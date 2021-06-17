<!DOCTYPE html>
<html>
	<head>
		<!-- Global site tag (gtag.js) - Google Analytics -->
		<script async src="https://www.googletagmanager.com/gtag/js?id=UA-165024289-1"></script>
		<script>
		  window.dataLayer = window.dataLayer || [];
		  function gtag(){dataLayer.push(arguments);}
		  gtag('js', new Date());

		  gtag('config', 'UA-165024289-1');
		</script>
		<link rel="canonical" href="https://www.playeraudit.com/about.html" />
		<html lang="en">	
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Report Data - DDO Player Audit</title>
		<meta charset="utf-8">
		<meta name="description" content="Download raw report data for your own personal use.">
		<meta name="keywords" content="ddo,dungeons and dragons online,player,count,concurrency,population,groups,lfms,argonnessen,cannith,ghallanda,khyber,orien,sarlona,thelanis,live">
		
		<?php require('../elements/pwa.html'); ?>
	</head>
	<body>
	<div class="content">
		<?php require('../elements/banner.html'); ?>
		<?php require('../elements/theme_switch.html'); ?>
		<header>
			<?php require('../elements/nav_bar.html'); ?>
			<script>
				document.getElementById('nav_about').classList.add('active');
			</script>
		</header>
		<main>
		<div class="card">
			<h1 align="center" style="margin-bottom: -15px;"><u>Data Repository</u></h1>
			<h3 align="center">Skip the charts. Go straight to the source.</h3>
			<article>
				<section>
					<p>
					<h3 style="margin-bottom: -10px;">If you're interested in the data, we got that too.</h3>
					</p>
					<p>Want to see what's going on behind the scenes? Maybe you're looking to make some charts of your own, or perhaps you'd like the data for a project. You're in luck.</p>
				</section>
				<hr/>
				<section>
					<h2 style="margin-bottom: -10px;">Data by Server</h2>
					<h3>Argonnessen</h3>
					<ul>
						<li><a href="argonnessen/24hr_by_minute.csv">24 Hours by Minute</a><label class="formatDecription"> (Format: Time,Players,LFMs)</label></li>
						<li><a href="argonnessen/1_week_by_hour.csv">1 Week Summarized by Hourly Averages</a><label class="formatDecription"> (Format: Time,Players,LFMs)</label></li>
						<li><a href="argonnessen/1_week_by_dow.csv">1 Week Summarized by Day-of-Week Averages</a><label class="formatDecription"> (Format: Day,Players,LFMs)</label></li>
						<li><a href="argonnessen/1_week_by_time_of_day.csv">1 Week Summarized by Time-of-Day Averages</a><label class="formatDecription"> (Format: Hour,Players,LFMs)</label></li>
						<li><a href="argonnessen/90_days_by_hour.csv">1 Quarter Summarized by Hourly Averages</a><label class="formatDecription"> (Format: Time,Players,LFMs)</label></li>
						<li><a href="argonnessen/90_days_by_day.csv">1 Quarter Summarized by Daily Averages</a><label class="formatDecription"> (Format: Time,Players,LFMs)</label></li>
						<li><a href="argonnessen/90_days_by_dow.csv">1 Quarter Summarized by Day-of-Week Averages</a><label class="formatDecription"> (Format: Day,Players,LFMs)</label></li>
						<li><a href="argonnessen/90_days_by_time_of_day.csv">1 Quarter Summarized by Time-of-Day Averages</a><label class="formatDecription"> (Format: Hour,Players,LFMs)</label></li>
					</ul>
					<h3>Cannith</h3>
					<ul>
						<li><a href="cannith/24hr_by_minute.csv">24 Hours by Minute</a></li>
						<li><a href="cannith/1_week_by_hour.csv">1 Week Summarized by Hourly Averages</a></li>
						<li><a href="cannith/1_week_by_dow.csv">1 Week Summarized by Day-of-Week Averages</a></li>
						<li><a href="cannith/1_week_by_time_of_day.csv">1 Week Summarized by Time-of-Day Averages</a></li>
						<li><a href="cannith/90_days_by_hour.csv">1 Quarter Summarized by Hourly Averages</a></li>
						<li><a href="cannith/90_days_by_day.csv">1 Quarter Summarized by Daily Averages</a></li>
						<li><a href="cannith/90_days_by_dow.csv">1 Quarter Summarized by Day-of-Week Averages</a></li>
						<li><a href="cannith/90_days_by_time_of_day.csv">1 Quarter Summarized by Time-of-Day Averages</a></li>
					</ul>
					<h3>Ghallanda</h3>
					<ul>
						<li><a href="ghallanda/24hr_by_minute.csv">24 Hours by Minute</a></li>
						<li><a href="ghallanda/1_week_by_hour.csv">1 Week Summarized by Hourly Averages</a></li>
						<li><a href="ghallanda/1_week_by_dow.csv">1 Week Summarized by Day-of-Week Averages</a></li>
						<li><a href="ghallanda/1_week_by_time_of_day.csv">1 Week Summarized by Time-of-Day Averages</a></li>
						<li><a href="ghallanda/90_days_by_hour.csv">1 Quarter Summarized by Hourly Averages</a></li>
						<li><a href="ghallanda/90_days_by_day.csv">1 Quarter Summarized by Daily Averages</a></li>
						<li><a href="ghallanda/90_days_by_dow.csv">1 Quarter Summarized by Day-of-Week Averages</a></li>
						<li><a href="ghallanda/90_days_by_time_of_day.csv">1 Quarter Summarized by Time-of-Day Averages</a></li>
					</ul>
					<h3>Khyber</h3>
					<ul>
						<li><a href="khyber/24hr_by_minute.csv">24 Hours by Minute</a></li>
						<li><a href="khyber/1_week_by_hour.csv">1 Week Summarized by Hourly Averages</a></li>
						<li><a href="khyber/1_week_by_dow.csv">1 Week Summarized by Day-of-Week Averages</a></li>
						<li><a href="khyber/1_week_by_time_of_day.csv">1 Week Summarized by Time-of-Day Averages</a></li>
						<li><a href="khyber/90_days_by_hour.csv">1 Quarter Summarized by Hourly Averages</a></li>
						<li><a href="khyber/90_days_by_day.csv">1 Quarter Summarized by Daily Averages</a></li>
						<li><a href="khyber/90_days_by_dow.csv">1 Quarter Summarized by Day-of-Week Averages</a></li>
						<li><a href="khyber/90_days_by_time_of_day.csv">1 Quarter Summarized by Time-of-Day Averages</a></li>
					</ul>
					<h3>Orien</h3>
					<ul>
						<li><a href="orien/24hr_by_minute.csv">24 Hours by Minute</a></li>
						<li><a href="orien/1_week_by_hour.csv">1 Week Summarized by Hourly Averages</a></li>
						<li><a href="orien/1_week_by_dow.csv">1 Week Summarized by Day-of-Week Averages</a></li>
						<li><a href="orien/1_week_by_time_of_day.csv">1 Week Summarized by Time-of-Day Averages</a></li>
						<li><a href="orien/90_days_by_hour.csv">1 Quarter Summarized by Hourly Averages</a></li>
						<li><a href="orien/90_days_by_day.csv">1 Quarter Summarized by Daily Averages</a></li>
						<li><a href="orien/90_days_by_dow.csv">1 Quarter Summarized by Day-of-Week Averages</a></li>
						<li><a href="orien/90_days_by_time_of_day.csv">1 Quarter Summarized by Time-of-Day Averages</a></li>
					</ul>
					<h3>Sarlona</h3>
					<ul>
						<li><a href="sarlona/24hr_by_minute.csv">24 Hours by Minute</a></li>
						<li><a href="sarlona/1_week_by_hour.csv">1 Week Summarized by Hourly Averages</a></li>
						<li><a href="sarlona/1_week_by_dow.csv">1 Week Summarized by Day-of-Week Averages</a></li>
						<li><a href="sarlona/1_week_by_time_of_day.csv">1 Week Summarized by Time-of-Day Averages</a></li>
						<li><a href="sarlona/90_days_by_hour.csv">1 Quarter Summarized by Hourly Averages</a></li>
						<li><a href="sarlona/90_days_by_day.csv">1 Quarter Summarized by Daily Averages</a></li>
						<li><a href="sarlona/90_days_by_dow.csv">1 Quarter Summarized by Day-of-Week Averages</a></li>
						<li><a href="sarlona/90_days_by_time_of_day.csv">1 Quarter Summarized by Time-of-Day Averages</a></li>
					</ul>
					<h3>Thelanis</h3>
					<ul>
						<li><a href="thelanis/24hr_by_minute.csv">24 Hours by Minute</a></li>
						<li><a href="thelanis/1_week_by_hour.csv">1 Week Summarized by Hourly Averages</a></li>
						<li><a href="thelanis/1_week_by_dow.csv">1 Week Summarized by Day-of-Week Averages</a></li>
						<li><a href="thelanis/1_week_by_time_of_day.csv">1 Week Summarized by Time-of-Day Averages</a></li>
						<li><a href="thelanis/90_days_by_hour.csv">1 Quarter Summarized by Hourly Averages</a></li>
						<li><a href="thelanis/90_days_by_day.csv">1 Quarter Summarized by Daily Averages</a></li>
						<li><a href="thelanis/90_days_by_dow.csv">1 Quarter Summarized by Day-of-Week Averages</a></li>
						<li><a href="thelanis/90_days_by_time_of_day.csv">1 Quarter Summarized by Time-of-Day Averages</a></li>
					</ul>
					<h3>Wayfinder</h3>
					<ul>
						<li><a href="wayfinder/24hr_by_minute.csv">24 Hours by Minute</a></li>
						<li><a href="wayfinder/1_week_by_hour.csv">1 Week Summarized by Hourly Averages</a></li>
						<li><a href="wayfinder/1_week_by_dow.csv">1 Week Summarized by Day-of-Week Averages</a></li>
						<li><a href="wayfinder/1_week_by_time_of_day.csv">1 Week Summarized by Time-of-Day Averages</a></li>
						<li><a href="wayfinder/90_days_by_hour.csv">1 Quarter Summarized by Hourly Averages</a></li>
						<li><a href="wayfinder/90_days_by_day.csv">1 Quarter Summarized by Daily Averages</a></li>
						<li><a href="wayfinder/90_days_by_dow.csv">1 Quarter Summarized by Day-of-Week Averages</a></li>
						<li><a href="wayfinder/90_days_by_time_of_day.csv">1 Quarter Summarized by Time-of-Day Averages</a></li>
					</ul>
					<h3>Hardcore</h3>
					<ul>
						<li><a href="hardcore/24hr_by_minute.csv">24 Hours by Minute</a></li>
						<li><a href="hardcore/1_week_by_hour.csv">1 Week Summarized by Hourly Averages</a></li>
						<li><a href="hardcore/1_week_by_dow.csv">1 Week Summarized by Day-of-Week Averages</a></li>
						<li><a href="hardcore/1_week_by_time_of_day.csv">1 Week Summarized by Time-of-Day Averages</a></li>
						<li><a href="hardcore/90_days_by_hour.csv">1 Quarter Summarized by Hourly Averages</a></li>
						<li><a href="hardcore/90_days_by_day.csv">1 Quarter Summarized by Daily Averages</a></li>
						<li><a href="hardcore/90_days_by_dow.csv">1 Quarter Summarized by Day-of-Week Averages</a></li>
						<li><a href="hardcore/90_days_by_time_of_day.csv">1 Quarter Summarized by Time-of-Day Averages</a></li>
					</ul>
					<h2 style="margin-bottom: -10px;">Other Data Collections</h2>
					<h3>All Servers (Combined)</h3>
					<ul>
						<li><a href="all/24hr_by_minute.csv">24 Hours by Minute</a></li>
						<li><a href="all/1_week_by_hour.csv">1 Week Summarized by Hourly Averages</a></li>
						<li><a href="all/1_week_by_dow.csv">1 Week Summarized by Day-of-Week Averages</a></li>
						<li><a href="all/1_week_by_time_of_day.csv">1 Week Summarized by Time-of-Day Averages</a></li>
						<li><a href="all/90_days_by_hour.csv">1 Quarter Summarized by Hourly Averages</a></li>
						<li><a href="all/90_days_by_day.csv">1 Quarter Summarized by Daily Averages</a></li>
						<li><a href="all/90_days_by_dow.csv">1 Quarter Summarized by Day-of-Week Averages</a></li>
						<li><a href="all/90_days_by_time_of_day.csv">1 Quarter Summarized by Time-of-Day Averages</a></li>
					</ul>
					<h3>All Servers (Composite, player data only)</h3>
					<ul>
						<li><a href="composite/24hr_by_minute.csv">24 Hours by Minute</a><label class="formatDecription"> (Format: Time,Argonnessen,Cannith,Ghallanda,Khyber,Orien,Sarlona,Thelanis,Wayfinder,Hardcore)</label></li>
						<li><a href="composite/24hr_by_hour.csv">24 Hours by Hourly Average</a><label class="formatDecription"> (Format: Time,Argonnessen,Cannith,Ghallanda,Khyber,Orien,Sarlona,Thelanis,Wayfinder,Hardcore)</label></li>
						<li><a href="composite/1_week_by_hour.csv">1 Week Summarized by Hourly Averages</a><label class="formatDecription"> (Format: Time,Argonnessen,Cannith,Ghallanda,Khyber,Orien,Sarlona,Thelanis,Wayfinder,Hardcore)</label></li>
						<li><a href="composite/1_week_by_dow.csv">1 Week Summarized by Day-of-Week Averages</a><label class="formatDecription"> (Format: Time,Argonnessen,Cannith,Ghallanda,Khyber,Orien,Sarlona,Thelanis,Wayfinder,Hardcore)</label></li>
						<li><a href="composite/1_week_by_time_of_day.csv">1 Week Summarized by Time-of-Day Averages</a><label class="formatDecription"> (Format: Time,Argonnessen,Cannith,Ghallanda,Khyber,Orien,Sarlona,Thelanis,Wayfinder,Hardcore)</label></li>
						<li><a href="composite/90_days_by_hour.csv">1 Quarter Summarized by Hourly Averages</a><label class="formatDecription"> (Format: Time,Argonnessen,Cannith,Ghallanda,Khyber,Orien,Sarlona,Thelanis,Wayfinder,Hardcore)</label></li>
						<li><a href="composite/90_days_by_day.csv">1 Quarter Summarized by Daily Averages</a><label class="formatDecription"> (Format: Time,Argonnessen,Cannith,Ghallanda,Khyber,Orien,Sarlona,Thelanis,Wayfinder,Hardcore)</label></li>
						<li><a href="composite/90_days_by_dow.csv">1 Quarter Summarized by Day-of-Week Averages</a><label class="formatDecription"> (Format: Time,Argonnessen,Cannith,Ghallanda,Khyber,Orien,Sarlona,Thelanis,Wayfinder,Hardcore)</label></li>
						<li><a href="composite/90_days_by_time_of_day.csv">1 Quarter Summarized by Time-of-Day Averages</a><label class="formatDecription"> (Format: Time,Argonnessen,Cannith,Ghallanda,Khyber,Orien,Sarlona,Thelanis,Wayfinder,Hardcore)</label></li>
					</ul>
					<br/><br/>
					<p>The reports listed on this page are generated automatically and are not maintained by me. Some of the reports are generated each minute, while others are generated daily or monthly.<br/><i>Report formats are subject to change. Reports are subject to removal without notice.</i></p>
				</section>
			</article>
		</div>
		</main>
	</div>
	<div id="footer" style="background-color: #333;color: white;"><div class="footertext"></div></div>
	</body>

	<script>
		<?php require('elements/cookies.js'); ?>
	</script>
</html>