<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Blurt</title>
	
		<meta name="description" content="Get some Science Bowl skills. Fast.">
		<meta name="author" content="Sanjay Kannan">
    
		<script src="js/jquery.min.js"></script>
		<script src="js/bootstrap.min.js"></script>
		<script src="js/scripts.js"></script>
    
		<link href="css/bootstrap.min.css" rel="stylesheet">
		<link href="css/style.css" rel="stylesheet">
		<link href="img/favicon.ico" rel="shortcut icon">
	</head>

	<body>

	<div class="navbar">
		<div class="navbar-inner">
			<a class="brand" href="">Blurt</a>
			<p class="navbar-text pull-right">Get some Science Bowl skills. Fast.</div>
		</div>
    </div>

	<div class="container-fluid">
		<div class="row-fluid">
			<div class="span9">
				<ul class="breadcrumb">
					<li class="active" id="id">Press Start to begin practicing!</li>
					<li class="active pull-right" id="info">Design inspired by Protobowl.com.</li>
				</ul>
				
				<ul class="breadcrumb">
					<li class="active" id="author">Creator goes here.</li>
					<li class="active pull-right" id="uploader">Uploader goes here.</li>
				</ul>
				
				<div class="hero-unit" id="question" style="padding: 15px; font-weight: normal;">
					Question goes here.
				</div>
				
				<ul class="breadcrumb" id="bottom">
					<li class="active" id="answer">Your answer will go here.</li>
				</ul>
			</div>
			
			<div class="span3">
				<div class="well thumbnail" id="time">
					<div class="progress progress-striped active" id="level" style="margin-bottom: 0px;">
						<div class="bar bar-success level11" style="width: 100%;"></div>
						<div class="bar bar-info level12" style="width: 0%;"></div>
					</div>
				</div>
				
				<div class="well thumbnail" id="time">
					<div class="progress progress-striped active" id="level2" style="margin-bottom: 0px;">
						<div class="bar bar-success level21" style="width: 100%;"></div>
						<div class="bar bar-danger level22" style="width: 0%;"></div>
					</div>
				</div>
				
				<div class="well pagination-centered">
					<button class="btn btn-primary" style="width: 47%" id="start"><u>S</u>tart</button>
					<button class="btn btn-danger" style="width: 47%; display: none;" id="buzz"><u>B</u>uzz</button>
					<button class="btn btn-info pull-right" style="width: 47%" id="pause"><u>P</u>ause</button>
					<button class="btn btn-success pull-right" style="width: 47%; display: none;" id="resume"><u>R</u>esume</button>
				</div>
				
				<div class="well thumbnail pagination-centered" id="score">
					Your Score: <span id="points">0</span> / Negs: <span id="negs">0</span><br>
					Neg/Interrupt Ratio: <span id="ratio">0</span>%
				</div>
				
				<div class="well thumbnail pagination-centered" id="score">
					Please report any malformed questions by ID. All questions originally scraped from Scibowl.com. Thank you!
				</div>
			</div>
		</div>
    </div>

	</body>
</html>