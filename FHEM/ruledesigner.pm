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
			
#			if ($k eq 'q') { $query = $a; }
#			if ($k eq 't') { $text = $a; }
#			if ($k eq 'name') { $rule{'name'} = $a; }
#			if ($k eq 'device') { $rule{'device'} = $a; }
#			if ($k eq 'state') { $rule{'state'} = $a; }
#			if ($k eq 'at') { $rule{'at'} =$a; $rule{'at'} =~ s/%3A/:/g;}
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
		return createRule($attr{'json'});
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
sub createRule
{
	my $json = @_;
	$json = decode_json($json);
	
	my $rule = "";
	
	while ( my($key, $value) = each $json ) {
		$rule .= "$key = $value\n";
	}
	
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