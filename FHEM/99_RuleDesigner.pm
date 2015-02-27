##############################################################################
#	The RuleDesigner Modul
#	- receives rule description,
#	- manages this rules within in a local database,
#	- and compiles the received rule description into FHEM rules.
#
#	The source code is segmented into the following secitons
#	- FHEM MODULE FUNCTIONS
#	- CGI
#	- RULE REPOSITORY
#	- RULE COMPILER
#	
#	Documentation: http://www2.htw-dresden.de/~wiki_sn/index.php5/FHEM/Regelerstellung#FHEM_Modul
#
#		 __    __  ________  __       __        _______   _______  
#		|  \  |  \|        \|  \  _  |  \      |       \ |       \ 
#		| $$  | $$ \$$$$$$$$| $$ / \ | $$      | $$$$$$$\| $$$$$$$\
#		| $$__| $$   | $$   | $$/  $\| $$      | $$  | $$| $$  | $$
#		| $$    $$   | $$   | $$  $$$\ $$      | $$  | $$| $$  | $$
#		| $$$$$$$$   | $$   | $$ $$\$$\$$      | $$  | $$| $$  | $$
#		| $$  | $$   | $$   | $$$$  \$$$$      | $$__/ $$| $$__/ $$
#		| $$  | $$   | $$   | $$$    \$$$      | $$    $$| $$    $$
#		 \$$   \$$    \$$    \$$      \$$       \$$$$$$$  \$$$$$$$ 
#
#		HTW Dresden
#		Forschungsseminar Sensornetze 2014-2015
#		Felix Pistorius
#
#﻿#############################################################################
package main;
use strict;
use warnings;


use DBI;
use Switch 'Perl5', 'Perl6';
use Net::Telnet;
use JSON;	# search.cpan.org/~makamaka/JSON-2.90/lib/JSON.pm
use Data::Dumper;

use vars qw(%data);


# Variables
my $MODULE_NAME = "wizard";#"ruledesigner";
my $url = "/ruledesigner/". $MODULE_NAME;
my $contenttype = "application/json; charset=UTF-8";
my $fhemhost = 'localhost';
my $fhemport = '8083';

my $placeholder = '%_%';


################################################################################
# FHEM MODULE FUNCTIONS 
################################################################################
sub 
RuleDesigner_Initialize($)
{
	my ($hash) = @_;
	$hash->{DefFn} = "RD_define";
	
	$data{FWEXT}{$url}{LINK} = "ruledesigner/".$MODULE_NAME."/index.html";
	$data{FWEXT}{$url}{NAME} = $MODULE_NAME;
	$data{FWEXT}{$url}{FUNC} = "RD_CGI";
	
	RD_Repo_Init();
}

################################################################################
# CGI
################################################################################
# handles all cgi requests for the rule designer modul
sub
RD_CGI()
{
	my ($htmlargs) = @_;
	my ($json_ret) = "";
	my $query = "";
	my %rule;
	my $regexop = undef;
	
	if($htmlargs =~ /$MODULE_NAME\?/) {
		# URL contains HTTP GET parameters
		$regexop = '[^\?]+\?(.*)';
	} elsif($htmlargs =~ /$MODULE_NAME\&/) {
		# URL contains HTTP POST parameters
		$regexop = '[^\&]+\&(.*)';
	}

	if ($regexop ne undef and $htmlargs =~ m/$regexop/) {
		foreach my $e (split(/&/, $1)) {
			my ($k, $a) = split(/=/, $e);
			
			given ($k) {
				when 'q'		{ $query = $a; }
				when 'json'		{ $rule{'json'} = urlDecode($a); }
				when 'id'		{ $rule{'id'} = urlDecode($a); }
			}
		}
		
		given ($query) {
			when 'devicelist'	{ $json_ret = RD_CGI_Devicelist(); }
			when 'rulelist'		{ $json_ret = RD_Repo_Rulelist(); }
			when 'define'		{ $json_ret = RD_CGI_Definerule(%rule);	}
			when 'delete'		{ RD_CGI_DeleteRule(%rule) }
			when 'deactivate'	{ RD_CGI_DeactivateRule(%rule) }
			when 'activate'		{ RD_CGI_ActivateRule(%rule) }
			when 'getrule'		{ $json_ret = RD_CGI_GetRule(%rule) }
			when 'check'		{ # TODO
			 }
			default				{ $json_ret = '{"TYPE": "Error", "Message": "Unsupported query: '.$query.'"}'; }
		}
		
	} else {
		$json_ret = '{"TYPE": "Error", "Message": "Query was empty."}';
	}

	return ($contenttype, $json_ret);
}

# handles rule deletion requests
sub RD_CGI_DeleteRule
{
	my %attr = @_;
	
	RD_Repo_DeleteRule($attr{'id'});
	RD_Telnet("delete ".$attr{'id'});
	RD_Telnet("save");
}

# handles rule deactivation requests
sub RD_CGI_DeactivateRule
{
	my %attr = @_;
	
	# state = 0 -> rule deactivated
	my $state = 0;
	
	RD_Repo_SetState($attr{'id'}, $state);
	RD_Telnet("delete ".$attr{'id'});
	RD_Telnet("save");
}

# handels rule activation requests
sub RD_CGI_ActivateRule
{
	my %attr = @_;
	
	# state = 1 -> rule activated
	my $state = 1;
	
	RD_Repo_SetState($attr{'id'}, $state);
	
	my $json = decode_json( RD_Repo_GetRule($attr{'id'}) );
	my %rule = %{ parseRule($json) };

	RD_Telnet($rule{'RULE'});
	RD_Telnet("save");
}

sub
RD_CGI_GetRule
{
	my %attr = @_;
	Log3($MODULE_NAME, 4, "Look for rule with id: ".$attr{'id'});
	return RD_Repo_GetRule($attr{'id'});
}

# returns a URL for a json list with all FHEM devices as json object.
sub
RD_CGI_Devicelist()
{
	my $json_ret = '{"TYPE": "URL"';
	$json_ret .= ', "msg":"'.$fhemhost.':'.$fhemport.'/fhem?cmd=jsonlist2&XHR=1"';
	$json_ret .= '}';
	
	return $json_ret;
}

# handles a transmitted rule description:
# - call the rule parser
# - insert the rule into the rule repository
# - sned the generated rule to FHEM
sub
RD_CGI_Definerule
{
	my %attr = @_;

	if ($attr{'json'}) {

		my $json_ref = decode_json($attr{'json'});
		my @json = @{$json_ref};

		for (values @json) {
			my %rule = %{ parseRule($_) };
			$rule{'JSON'} = encode_json($_);
			$rule{'STATE'} = 1;
			
			Log3($MODULE_NAME, 3, "generated rule: $rule{'RULE'}");
			
			RD_Repo_Insert(%rule);
			RD_Telnet($rule{'RULE'});
		}
		
		RD_Telnet("save");
		return '{"TYPE":"Info", "Message":"Success."}';
	}

	return '{"TYPE":"Error", "Message":"No rule."}';
}

################################################################################
# RULE REPOSITORY
################################################################################
# connect to the database
sub DBH
{
	my $dns = "DBI:SQLite:dbname=./rulerepository.sqlite.db";
	
	my $dbh = DBI->connect($dns, "", "", 
		{	RaiseError => 1,
			PrintError => 1,
			AutoCommit => 1
		}) or Log3 $MODULE_NAME, 1, "RuleDesigner can't connect to the database." and return;
		
	return $dbh;
}

# initialised the database with all tables
sub RD_Repo_Init()
{
	my $dbh = DBH();
	
	my $create_table_rule = 'CREATE TABLE IF NOT EXISTS rule 
	(ID INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20), json VARCHAR(1000), description VARCHAR(500), state INTEGER)';

	$dbh->do($create_table_rule) or Log3($MODULE_NAME, 1, "CAN'T CREATE TABLE 'RULE': $dbh->errstr()");
	
	$dbh->disconnect();
}

# insert a rule into the database
sub RD_Repo_Insert	
{
	my %rule = @_;
	my $dbh = DBH();
	
	my $sth = $dbh->prepare("INSERT INTO rule (name, json, description, state) VALUES (?,?,?,?)");
	$sth->execute($rule{'ID'}, $rule{'JSON'}, $rule{'PARAMS'}{'descr'},$rule{'STATE'});
	
	$dbh->disconnect();
}

# proof if rule id already exists
sub RD_Repo_IfExists
{
	my ($name) = @_;
	my $dbh = DBH();
	
	my $cnt = $dbh->selectrow_array("SELECT count(*) FROM rule WHERE name LIKE \"$name\"") 
		or Log3($MODULE_NAME, 1, "RD_Repo_IfExists: $dbh->errstr()");
	
	$dbh->disconnect();
	
	return $cnt;
}

# generates a json object with all managed rule ID's
sub RD_Repo_Rulelist
{
	my $dbh = DBH();
	
	my @values;
	my $r;
	
	my $sth = $dbh->prepare("SELECT name, description, state FROM rule");
	
	if ($sth->execute()) {
		
		while(my @row = $sth->fetchrow_array()) {
			push(@values, '{"NAME":"'.$row[0].'","DESCRIPTION":"'.$row[1].'","STATE":"'.$row[2].'"}');
		}
		
		$r = "[". join(',', @values) ."]";
	} else {
		Log3($MODULE_NAME, 1, "RD_Repo_Rulelist: $dbh->errstr()");
		$r = '{"TYPE":"Error", "Message":"Database Error (Rulelist)"}';
	}
	
	$dbh->disconnect();
	
	return $r;
}

# update the state of a rule
# possible states:
# -1 : not define
#  0 : deactivated
#  1 : active
sub RD_Repo_SetState
{
	my ($id, $state) = @_;
	
	my $dbh = DBH();
	my $sth = $dbh->prepare("UPDATE rule SET state = ? WHERE name is ?");
	
	$sth->execute($state, $id) or Log3($MODULE_NAME, 1, "RD_Repo_SetState: $dbh->errstr()");
	
	$dbh->disconnect();
}

# delete a record of a rule by the rule name
sub RD_Repo_DeleteRule
{
	my ($id) = @_;
	my $dbh = DBH();
	
	my $sth = $dbh->prepare("DELETE FROM rule WHERE name IS ?");
	
	$sth->execute($id) or Log3($MODULE_NAME, 1, "RD_Repo_DeleteRule: $dbh->errstr()");
	
	$dbh->disconnect();
}

# get the json representation of a rule
sub RD_Repo_GetRule
{
	my ($id) = @_;
	my $dbh = DBH();
	
	my $r = "";
	
	my $sth = $dbh->prepare("SELECT json FROM rule WHERE name IS ?");
	
	if ($sth->execute($id)) {
		my @row = $sth->fetchrow_array();
		$r = $row[0];
	} else {
		Log3($MODULE_NAME, 1, "RD_Repo_DeleteRule: $dbh->errstr()");
	}
	
	
	$dbh->disconnect();
	
	return $r;
}

# check wether a rule 
# - ~ name already exists
# - the rule condition and action already exists 
#	(independent of the name and description of a rule)
# - 
#sub RD_Repo_GetRule
#{
#	my %rule = @_;
#	
#	if ( RD_Repo_IfExists($rule{'ID'}) ) {
#		return '{"TYPE":"Error", "Message":"Rule name already exists."}';
#	}
#	
#	
#}

################################################################################
# RULE COMPILER
################################################################################
# start function to parse the rule description and to build the FHEM rule
# returns a hash value with all parsed elements (id, conditions, actions)
#	and the fhem rule itself.
sub parseRule
{
	my ($ref) = @_;
	my %rule = %$ref;
	my %res;

	for (keys %rule) {
		given ($_) {
			when 'ID' {
				$res{'ID'} = $rule{$_}; 
			}
			when 'PARAMS' {
				#$res{'PARAMS'} = parseParams($rule{$_});
				$res{'PARAMS'} = $rule{$_};
			}
			when 'COND'	{
				$res{'COND'} = parseCond($rule{$_});
			}
			when 'ACTION' {
				$res{'ACTION'} = parseActorList($rule{$_});
			}
			when 'VDEV' {
				#parseVdev($rule{$_}); 
				$res{'VDEV'} = vdevInterprator($rule{$_});
			}
		}
	}
	
	$res{'RULE'} = "define ".$res{"ID"};
	
	if ($res{'VDEV'}) {
		$res{'RULE'} .= " ".$res{'VDEV'}{'RULE'}." ";
		if($res{'VDEV'}{'COND'}) {
			$res{'RULE'} .= "{ if (".$res{'VDEV'}{'COND'}.")";
		}
		$res{'RULE'} .= $res{'ACTION'};
	} else {
		$res{'RULE'} .= $res{'COND'}{'RULE'}.$res{'ACTION'}."}";
	}
	#$res{'RULE'} .= $res{'COND'}{'RULE'}.$res{'ACTION'}."}";
	Log3($MODULE_NAME, 5, "Rule befor escape: ".$res{'RULE'});
	$res{'RULE'} = escapePerlForFHEM123($res{'RULE'});
	Log3($MODULE_NAME, 5, "Rule after escape: ".$res{'RULE'});
	
	return \%res;
}

# Parse rule:
# <conditions> -> <condition> | <gather>
sub parseCond
{
	my ($ref) = @_;
	my %cond = %$ref;
	my %res;
	
	if($cond{'SENSOR'} && $cond{'PARAMS'}) {
		%res = %{ parseCondition($ref) };
		$res{'RULE'} = ' notify ('.$res{'name'}.') { '. $res{'dec'} .' if ('.$res{'params'}.')';
		return \%res;
	}

	%res = %{parseGather($ref)};
	$res{'RULE'} = ' notify '.$res{'names'}.' { '. $res{'decs'} .' if ('.$res{'params'}.')';
	return \%res;
}

# Parese rule:
# <conditions> -> <condition> | <gather>
sub parseGatherCond
{
	my ($ref) = @_;
	
	my %cond = %{$ref};
	
	my %res;
	if($cond{'SENSOR'} && $cond{'PARAMS'}) {
		%res = %{ parseCondition($ref) };
	} else {
		%res = parseGather($ref);
		return "\n\n". Dumper(%res) ."\n\n";
	}
	return \%res;
}

# Parse rule:
#	<condition>	->	"SENSOR" : ID, 
#					"REF_PARAMS" : {<ref_param>(, <ref_param>)?}
sub parseCondition
{
	my ($cond) = @_;
	
	my %condition;
	
	while ( my($k, $v) = each $cond) {
		given ($k) {
			when 'SENSOR' {
				$condition{'name'} = $v;
				$condition{'dec'} = 'my $'.$v.'_val = $value{"'.$v.'"};;';
				$condition{'var'} = '$'.$v.'_val';  
			}
			when 'PARAMS'	{
				$condition{'params'} = "";
				while ( my($k2, $v2) = each $v) {
					$condition{'params'} .= parseCondParams($v2);
				}	
			}
		}
	}
	
	
	$condition{'params'} =~ s/$placeholder/$condition{'var'}/ge; 
	
	return \%condition;
}

# Parse rule:
#	<LOG_GATHER> : [<conditions>(, <conditions>)?]
sub parseGather
{
	my ($gather) = @_;
	
	my $loggather = undef;
	my @conditions5;
	#return "\n\n".Dumper($gather)."\n\n";
	my @k = keys %{$gather};
	
	given($k[0]) {
		when 'AND'	{ $loggather = '&&'; }
		when 'OR'	{ $loggather = '||'; }
	}
	
	for(values $gather) {
		for (values $_) {
			push(@conditions5, parseGatherCond($_));
		}
	}
	
	my @names;
	my @decs;
	my @params;
	for (@conditions5) {
		my %c = %{$_};
		push(@names, $c{'name'});
		push(@decs, $c{'dec'});
		push(@params, $c{'params'});
	}
	
	my %res;
	$res{'names'} = "(".createSeperatedString("|", @names).")";
	$res{'decs'} = createSeperatedString(" ", @decs);
	$res{'params'} = createSeperatedString(' '.$loggather.' ', @params)." ";
	
	return \%res;
}

# Parse rule:
#	<ref_param> : [<log_func>, <value>]
sub parseCondParams
{
	my ($params) = @_;
	my $ret = "";
	
	while( my($k,$v) = each $params) {
		given($k) {
			when 0 {
				my $op = undef;
				given $v {
					when '==' {$op = 'eq'; }
					when '!=' {$op = 'ne'; }
				}
				$ret .= "$placeholder $op";
			}
			when 1 {
				$ret .= ' "'. $v .'"';
			}
		}
	}
	
	return $ret;
}

# Parse rule
# <actors> -> <actor> (,<actor>)?
sub parseActorList
{
	my ($actions) = @_;
	
	my $act = "";
	
	while ( my($k, $v) = each $actions) {
		$act .= parseActor($v);
	}
	
	return "{ $act }";
}

# Parse rule of <actor>
sub parseActor
{
	my ($action) = @_;
	
	my $actor	= undef;
	my $state	= undef;
	
	while ( my($k, $v) = each $action) {
		given ($k) {
			when 'ACTOR' {
				$actor = $v; 
			}
			when 'PARAMS'	{
				$state = $v;	
			}
		}
	}
	
	my $rule = '{ fhem "set ';
	$rule .= $actor ." ". $state;
	$rule .= '" }';
	
	return $rule;
}

# Parse rule of <vdev>:
# {"TYPE": id, ["PARAMS":<params> | "REF_PARAMS": <ref_params>]}
sub parseVdev
{
	my ($vdev) = @_;
	
	my %res;

	while (my($k, $v) = each $vdev) {
		
		given ($k) {
			when 'TYPE' {
				$res{"TYPE"} = $v;
			}
			when 'PARAMS' {
				$res{"PARAMS"} = $v;
			}
			when 'REF_PARAMS' {
				$res{"REF_PARAMS"} = parseCondParams($v);
			}
		}
	}
	
	Log3($MODULE_NAME, 4, Dumper(%res));
}

# interprates the vitual device (vdev) type
sub vdevInterprator
{
	my %vdev = %{(shift)};
	my %rule;
	$rule{'VDEV'} = \%vdev;
	
	given ($vdev{"TYPE"}) {
		when 'VD_DIGITAL_TIMER' {
			my @sets = $vdev{'SETS'};
			
			my @wdays;
			foreach (split(//, $sets[0]))
			{
			      push(@wdays,'$wday == '.$_);
			}
			
			
			my @beginTime = $sets[1];
			
			my @endTime = $sets[2];
			

			my @beginDate = split(/\./,$sets[3]);
			my @date;
			push(@date, '$mday >= '.$beginDate[0]);
			push(@date, '$month >= '.$beginDate[1]);
			push(@date, '$year >= '.$beginDate[2]);
			
			my @endDate = split(/\./,$sets[4]);
			push(@date, '$mday <= '.$endDate[0]);
			push(@date, '$month <= '.$endDate[1]);
			push(@date, '$year <= '.$endDate[2]);
			
			my @cond;
			push(@cond, createSeperatedString(' || ', @wdays));
			push(@cond, createSeperatedString(' && ', @date));
			
			$rule{'COND'} = createSeperatedString(' && ', @cond);
			# TODO
			$rule{'RULE'} = "";
		}
		
		
		# at: http://fhem.de/commandref_DE.html#at
		# <timespec> Format: [+][*{N}]<timedet>
		# http://www.fhemwiki.de/wiki/AT_zu_einem_absoluten_Datum_ausf%C3%BChren
		when 'at' {
			$vdev{'TYPE'} = 'at';
			
			my $timespec;
			if( $vdev{'PARAMS'}{'TIMESPEC'}{'RELATIVE'} == 1) {
				$timespec .= '+';
			}
			
			if( $vdev{'PARAMS'}{'TIMESPEC'}{'REPEAT'} == 1) {
				$timespec .= '*';
			}
			
			if( $vdev{'PARAMS'}{'TIMESPEC'}{'COUNT'}) {
				$timespec .= '['.$vdev{'PARAMS'}{'TIMESPEC'}{'COUNT'}.']';
			}
			
			if( $vdev{'PARAMS'}{'TIMESPEC'}{'TIME'}) {
				# TIME Format: HH:MM:SS or HH:MM
				$timespec .= $vdev{'PARAMS'}{'TIMESPEC'}{'TIME'};
			} elsif( $vdev{'PARAMS'}{'TIMESPEC'}{'FUNC'}) {
				$timespec .= '{'.$vdev{'PARAMS'}{'TIMESPEC'}{'FUNC'}.'}';
			}
			
			my @cond;
			if( $vdev{'PARAMS'}{'CONDITION'}{'WEEKDAY'} ) {
				my @wdays;
				foreach (split(//, $vdev{'PARAMS'}{'CONDITION'}{'WEEKDAY'}))
				{
				      push(@wdays,'$wday == '.$_);
				}
				push(@cond, createSeperatedString(' || ', @wdays));
			}
			
			if( $vdev{'PARAMS'}{'CONDITION'}{'DATE'} ) {
				push(@cond, '$mday == '.$vdev{'PARAMS'}{'CONDITION'}{'DATE'}{'DAY'});
				push(@cond, '$month == '.$vdev{'PARAMS'}{'CONDITION'}{'DATE'}{'MONTH'});
				push(@cond, '$year == '.$vdev{'PARAMS'}{'CONDITION'}{'DATE'}{'YEAR'});
			}
			
			if( $vdev{'PARAMS'}{'CONDITION'}{'STARTDATE'} ) {
				push(@cond, '$mday >= '.$vdev{'PARAMS'}{'CONDITION'}{'STARTDATE'}{'DAY'});
				push(@cond, '$month >= '.$vdev{'PARAMS'}{'CONDITION'}{'STARTDATE'}{'MONTH'});
				push(@cond, '$year >= '.$vdev{'PARAMS'}{'CONDITION'}{'STARTDATE'}{'YEAR'});
			}
			
			if( $vdev{'PARAMS'}{'CONDITION'}{'ENDDATE'} ) {
				push(@cond, '$mday >= '.$vdev{'PARAMS'}{'CONDITION'}{'ENDDATE'}{'DAY'});
				push(@cond, '$month >= '.$vdev{'PARAMS'}{'CONDITION'}{'ENDDATE'}{'MONTH'});
				push(@cond, '$year >= '.$vdev{'PARAMS'}{'CONDITION'}{'ENDDATE'}{'YEAR'});
			}
			
			$rule{'COND'} = createSeperatedString(' && ', @cond);
			$rule{'RULE'} = 'at '.$timespec;
		}
		# WeekdayTimer: http://fhem.de/commandref.html#WeekdayTimer
		when 'WeekdayTimer' { }
		# sequence: http://fhem.de/commandref_DE.html#sequence
		when 'sequence' { }
		# SUNRISE_EL: http://fhem.de/commandref.html#SUNRISE_EL
		when 'SUNRISE_EL' { }
		# rain: http://fhem.de/commandref.html#rain
		when 'rain' { }
		# Heating_Control: http://fhem.de/commandref_DE.html#Heating_Control
		when 'Heating_Control' { }
		# Calendar: http://fhem.de/commandref_DE.html#Calendar
		when 'Calendar' { }
		# THRESHOLD: http://fhem.de/commandref_DE.html#THRESHOLD
		when 'THRESHOLD' { }
		# watchdog: http://fhem.de/commandref_DE.html#watchdog
		when 'watchdog' { }
	}
	
	return \%rule;
}

# Returns a seperated string by a given seperator and an array.
sub createSeperatedString
{
	my ($seperator, @list) = @_;
	
	my $lastIdx = $#list;
	my $res = "";
	
	if($lastIdx < 0) {
		return undef;
	}
	
	if($lastIdx == 0) {
		return $list[0];
	}
	
	for(my $i=0; $i<$lastIdx; $i++) {
		$res .= $list[$i].$seperator;
	}

	$res .= $list[$lastIdx];
	
	return $res;
}

# Escape Perl specific symbols for FHEM
sub escapePerlForFHEM123
{
	my ($str) = @_;
	
	Log3($MODULE_NAME, 5, "Bevor escape: ".$str);
	
	# escape % and @
	$str =~ s/%/%%/g;
	$str =~ s/@/@@/g;
	
	Log3($MODULE_NAME, 5, "After escape: ".$str);
	
	return $str;
}

# starts a telnet session to send the generated FHEM rule
sub RD_Telnet
{
	my ($rule) = @_;
	my $telnet = new Net::Telnet(Timeout=>10, 
		Errmode=>'die',
		Host => 'localhost',
		Port => '7072'); 
	print $rule;
	$telnet->open();
	$telnet->print($rule);
	$telnet->close();	
}