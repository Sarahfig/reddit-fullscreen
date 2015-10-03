<?php

// Init vars
$LOCAL_ROOT         = "~/public_html/reddittv";
$DESIRED_BRANCH     = "master";

// Clone fresh repo from github using desired local repo name and checkout the desired branch
echo shell_exec("cd {$LOCAL_ROOT} && git pull github {$DESIRED_BRANCH}");

die("done " . mktime());
