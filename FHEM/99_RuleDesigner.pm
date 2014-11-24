package main;
use strict;
use warnings;


use HttpUtils;
use DBI;
use Switch 'Perl5', 'Perl6';
use Net::Telnet;
use JSON;	# search.cpan.org/~makamaka/JSON-2.90/lib/JSON.pm

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
			when 'define'		{ $json_ret = &RD_CGI_Definerule(\%rule); }
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
	my %attr = %{(shift)};
	my $rule = "";

	if ($attr{'at'}) {
		$rule = "define $attr{'name'} at $attr{'at'} set $attr{'device'} $attr{'state'}";
	} elsif ($attr{'json'}) {
		my $json = decode_json($attr{'json'});
		#my $r1 = @json[0];
	
		#my $rule = %r1;#&parseRule(\%r1);
		my $rule = "";
		my $ret = "";
		#while ( my($key, $value) = each $r1) {
		while ( my($key, $value) = each $json) {
			#$rule .= "$key = $value\n";
			
			$rule = parseRule($value);
			$ret .= $rule;
			$ret .= "\n";
			RD_Telnet($rule);
			
			#while ( my($k, $v) = each %rn) {
			#	$rule .= "$k = $v\n";
			#}
			
		#	#$rule .= parseRule($value);
		}
		
		return $ret;
	} else {
		$rule = "set $attr{'device'} $attr{'state'}";
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
	my ($rule) = @_;

	my $id		= undef;
	my $params	= undef;
	my $cond	= undef;
	my $action	= undef;
	
	while ( my($k, $v) = each $rule) {
		given ($k) {
			when 'ID' {
				$id = $v; 
			}
			#when 'PARAMS' {
			#	$params = parseParams($v);
			#}
			when 'COND'	{
				$cond = parseCond($v);
			}
			when 'ACTION' {
				$action = parseActionArray($v);
			}
		}
	}
	
	#define Schalter1NotifyOfficeOn notify EnO_switch_00295543 { if ("%" eq "on") { fhem("set Office on") } }
	my $rule = "define ";
	$rule .= $id;
	$rule .= $cond;
	$rule .= $action;
	$rule .= '}';
	
	return $rule;
}

sub parseParams
{
	return "";
}

sub parseCond
{
	my ($cond) = @_;
	
	my $sensor = undef;
	my $params = undef;
	
	while ( my($k, $v) = each $cond) {
		given ($k) {
			when 'SENSOR' {
				$sensor = $v; 
			}
			when 'PARAMS'	{
				$params = "";
				while ( my($k2, $v2) = each $v) {
					$params .= parseCondParams($v2);
				}	
			}
		}
	}
	
	my $ret = " notify ";
	$ret .= $sensor;
	$ret .= ' { if ';
	$ret .= $params;
	#$ret .= ')';
	
	return $ret;
}

sub parseCondParams
{
	my ($params) = @_;
	
	my $ret = "";
	
	#my $op = $params[0];
	#my $st = $params[1];
	#$ret .= '("%" eq "'. $op .'")';
	
	while( my($k,$v) = each $params) {
		given($k) {
			when 0 {
				my $op = undef;
				given $v {
					when '==' {$op = 'eq'; }
					when '!=' {$op = 'ne'; }
				}
				$ret .= '("%" '. $op; #eq "'. $op .'")';
				#$ret .= $k .' = '. $v;
				#my $op = $v[0];
				#my $st = $v[1];
				#$ret .= '("%" eq "'. $st .'")';
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