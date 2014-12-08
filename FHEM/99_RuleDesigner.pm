package main;
use strict;
use warnings;


use HttpUtils;
use DBI;
use Switch 'Perl5', 'Perl6';
use Net::Telnet;
use JSON;	# search.cpan.org/~makamaka/JSON-2.90/lib/JSON.pm
use Data::Dumper;

use vars qw(%data);


# Module-Functions
#sub RuleDesigner_Initialize($);
#sub RD_define();

# Functions
#sub RD_CGI_Definerule($);

# Variables
my $name = "ruledesigner";
my $url = "/". $name;
my $contenttype = "application/json; charset=UTF-8";


################################################################################
# FHEM MODULE FUNCTIONS 
################################################################################
sub 
RuleDesigner_Initialize($)
{
	my ($hash) = @_;
	$hash->{DefFn} = "RD_define";
	
	$data{FWEXT}{$url}{LINK} = $name ."/index.html";
	$data{FWEXT}{$url}{NAME} = "Rule Designer";
	$data{FWEXT}{$url}{FUNC} = "RD_CGI";
	
	RD_Repo_Init();
}

################################################################################
# CGI
################################################################################
sub
RD_CGI()
{
	my ($htmlargs) = @_;
	my ($json_ret) = "";
	my $query = "";
	my $text = "";
	my %rule;
	my $regexop = undef;
	
	if($htmlargs =~ /ruledesigner\?/) {
		# URL contains HTTP GET parameters
		$regexop = '[^\?]+\?(.*)';
	} elsif($htmlargs =~ /ruledesigner\&/) {
		# URL contains HTTP POST parameters
		$regexop = '[^\&]+\&(.*)';
	}

	if ($regexop ne undef and $htmlargs =~ m/$regexop/) {
		foreach my $e (split(/&/, $1)) {
			my ($k, $a) = split(/=/, $e);
			
			given ($k) {
				when 'q'		{ $query = $a; }
				when 't'		{ $text = $a; }
				when 'name'		{ $rule{'name'} = $a; }
				when 'device'	{ $rule{'device'} = $a; }
				when 'state'	{ $rule{'state'} = $a; }
				when 'at'		{ $rule{'at'} =$a; $rule{'at'} =~ s/%3A/:/g;}
				when 'json'		{ $rule{'json'} = urlDecode($a); }
			}
		}
		
		given ($query) {
			when 'devicelist'	{ $json_ret = RD_CGI_Devicelist(); }
			when 'define'		{ 
				#$json_ret = &RD_CGI_Definerule(\%rule);
				$json_ret = RD_CGI_Definerule(%rule); 
			}
			default				{ $json_ret = '{"type": "error", "msg": "unsupported query"}'; }
		}
		
	} else {
		$json_ret = '{"type": "error", "msg": "query was empty"}';
	}

	return ($contenttype, $json_ret);
}

sub
RD_CGI_Devicelist()
{
	my $json_ret = '{"type": "url"';
	$json_ret .= ', "msg":"localhost:8083/fhem?cmd=jsonlist2&XHR=1"';
	$json_ret .= '}';
	
	return $json_ret;
}

sub
RD_CGI_Definerule
{
	my %attr = @_;
	my $rule = "";

	if ($attr{'json'}) {
		my $json_ref = decode_json($attr{'json'});
		my @json = @{$json_ref};

		for (values @json) {
			$rule .= parseRule($_);
			$rule .= "\n";
			RD_Telnet($rule);
		}
		
		return $rule;
	} else {
		return "error: no rule";
	}
	$attr{"rule"} = $rule;
	
	my $json_ret = '{"type": "definerule"';
	$json_ret .= ', "rule": "'.$rule.'"';
	$json_ret .= '}';
	
	#&RD_Repo_Insert(\%attr);
	RD_Telnet($rule);
	
	return $json_ret;
}

################################################################################
# RULE REPOSITORY
################################################################################
my $dns = "DBI:SQLite:dbname=/tmp/rulerepository.sqlite.db";

sub
RD_Repo_Init()
{
	my $dbh = DBI->connect($dns, "", "", 
		{	RaiseError => 1,
			PrintError => 1,
			AutoCommit => 1
		}) or die "Oops: $DBI::errstr\n";
	
	my $create_table_rule = 'CREATE TABLE  IF NOT EXISTS rule (ID INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20), json VARCHAR(200))';
	my $create_table_device = 'CREATE TABLE  IF NOT EXISTS device (ID INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20))';
	my $create_table_devicelist = 'CREATE TABLE  IF NOT EXISTS devicelist (ruleID INTEGER, deviceID INTEGER)';

	$dbh->do($create_table_rule) or die "CAN'T CREATE TABLE 'RULE': " .$dbh->errstr();
	$dbh->do($create_table_device) or die "CAN'T CREATE TABLE 'DEVICE': " .$dbh->errstr();
	$dbh->do($create_table_devicelist) or die "CAN'T CREATE TABLE 'DEVICELIST': " .$dbh->errstr();
	
	$dbh->disconnect();
}

sub RD_Repo_Insert	
{
	my %attr = %{(shift)};
	my $dbh = DBI->connect($dns, "", "", 
		{	RaiseError => 1,
			PrintError => 1,
			AutoCommit => 1
		}) or die "Oops: $DBI::errstr\n";
	
	
	my $cnt = $dbh->do("SELECT count(*) FROM device WHERE name LIKE \"$attr{'device'}\"");
	
	if ($cnt == 0) {
		$dbh->do("INSERT INTO device (name) VALUES (\"$attr{'device'}\")")
			or die "RD_Repo_Insert (device): ". $dbh->errstr();
	}
	
	$dbh->do("INSERT INTO rule (name, json) VALUES (\"$attr{'name'}\",\"$attr{'rule'}\")") 
		or die "RD_Repo_Insert (rule): ". $dbh->errstr();
	
	$dbh->disconnect();
}

################################################################################
# RULE COMPILER
################################################################################
sub parseRule
{
	my ($ref) = @_;
	my %rule = %$ref;
	#return Dumper($rule);
	my $id		= undef;
	my $params	= undef;
	my $cond	= undef;
	my $action	= undef;
	my $vdef	= undef;
	
	for (keys %rule) {
		given ($_) {
			when 'ID' {
				$id = $rule{$_}; 
			}
			#when 'PARAMS' {
			#	$params = parseParams($v);
			#}
			when 'COND'	{
				$cond = parseCond($rule{$_});
			}
			when 'ACTION' {
				$action = parseActionArray($rule{$_});
			}
			when 'VDEV' {
				$vdef = undef;
			}
		}
	}
	
	#define Schalter1NotifyOfficeOn notify EnO_switch_00295543 { if ("%" eq "on") { fhem("set Office on") } }
	my $r = "define ";
	$r .= $id;
	$r .= $cond;
	$r .= $action;
	$r .= '}';
	
	return $r;
}

sub parseParams
{
	return "";
}

#
# <conditions> -> <condition> | <gather>
sub parseCond
{
	my ($ref) = @_;
	my %cond = %$ref;
	my %res;
	
	if($cond{'SENSOR'} && $cond{'PARAMS'}) {
		%res = %{ parseCondition($ref) };
		return ' notify '.$res{'name'}.' { if '.$res{'params'};
	}

	%res = %{parseGather($ref)};
	return ' notify '.$res{'names'}.' { '. $res{'decs'} .' if ('.$res{'params'}.')';
}

#
# <conditions> -> <condition> | <gather>
sub parseGatherCond
{
	my ($ref) = @_;
	
	#return "\n\n". Dumper($ref) ."\n\n";
	
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

#
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
				$condition{'dec'} = 'my $'.$v.'_val = $value("'.$v.'");;';
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
	
	$condition{'params'} =~ s/%/$condition{'var'}/ge; 
	
	return \%condition;
}

#
#	<LOG_GATHER> : [<conditions>(, <conditions>)?]
sub parseGather
{
	my ($gather) = @_;
	
	my $loggather = undef;
	my @conditions5;
	#return "\n\n".Dumper($gather)."\n\n";
	my @k = keys %{$gather};
	
	given(@k[0]) {
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
	$res{'decs'} = createSeperatedString("\n", @decs)."\n";
	$res{'params'} = createSeperatedString($loggather, @params)." ";
	
	return \%res;
}

#
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
				$ret .= '("%" '. $op;
			}
			when 1 {
				$ret .= ' "'. $v .'")';
			}
		}
	}
	
	return $ret;
}

sub parseActionArray
{
	my ($actions) = @_;
	
	my $act = "";
	
	while ( my($k, $v) = each $actions) {
		$act .= parseAction($v);
	}
	
	return $act;
}

sub parseAction
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
	
	my $rule = '{ fhem("set ';
	$rule .= $actor ." ". $state;
	$rule .= '") }';
	
	return $rule;
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

sub RD_Telnet
{
	print "RD_Telnet";
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