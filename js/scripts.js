var words;
var progress;
var endTimer;
var correct;
var position;
var interrupts = 0;
var score = 0;
var negs = 0;
var endTime = 6000;
var buzzTime = 8000;
var speed = 550;
var reading = false;
var buzzed = false;
var ended = false;

function levenshtein(str1, str2) {
	var m = str1.length,
		n = str2.length,
		d = [],
		i, j;

	if (!m) return n;
	if (!n) return m;

	for (i = 0; i <= m; i++) d[i] = [i];
	for (j = 0; j <= n; j++) d[0][j] = j;

	for (j = 1; j <= n; j++) {
		for (i = 1; i <= m; i++) {
			if (str1[i-1] == str2[j-1]) d[i][j] = d[i - 1][j - 1];
			else d[i][j] = Math.min(d[i-1][j], d[i][j-1], d[i-1][j-1]) + 1;
		}
	}
	
	return d[m][n];
}

function diff(a, b) {
	var seen = [], diff = [];
	for ( var i = 0; i < b.length; i++)
		seen[b[i]] = true;
	for ( var i = 0; i < a.length; i++)
		if (!seen[a[i]])
			diff.push(a[i]);
	return diff;
}

function checkAnswer(trial, actual) {
	trial = trial.toLowerCase().split(' ');
	actual = actual.toLowerCase().split(' ');
	
	particles = ['the', 'and', 'for', 'nor', 'but', 'yet', 'prompt', 'accept'];
	
	for (i = 0; i < trial.length; i++){
		if (trial[i].length < 3){
			particles.push(trial[i]);
		}
	}
	
	for (i = 0; i < actual.length; i++){
		if (actual[i].length < 3){
			particles.push(actual[i]);
		}
	}
	
	trial = diff(trial, particles);
	actual = diff(actual, particles);
	
	for (i = 0; i < actual.length; i++){
		for (j = 0; j < trial.length; j++){
			if (levenshtein(actual[i], trial[j]) <= Math.round(0.4 * actual[i].length)){
				return true;
			}
		}
	}
	
	return false;
}

function read() {
	words = words.split(' ');
	reading = true; append();
}

function append() {
	if (reading == true) {
		if (position < words.length) {
			$('#pause').removeClass('disabled').attr('disabled', false);
			$('#question').append(words[position] + ' ');
			position = position + 1; setTimeout(append, 550);
		}
		
		else{
			$('#pause').addClass('disabled').attr('disabled', true);
			endTimer = setTimeout(end, endTime);
			reading = false;
			
			percentValue = 100;
			progress = setInterval(function() {
				if (percentValue > 0){
					percentValue = percentValue - 1;
					
					$('.level12').css('width', String(100 - percentValue) + '%');
					$('.level11').css('width', String(percentValue) + '%');
				}
				
				else{
					clearInterval(progress);
				}
			}, endTime/100);
		}
	}
}

function end(result) { 
	if (ended == false){
		clearInterval(progress);
		clearTimeout(endTimer);
		
		result = (typeof result === "undefined") ? 0 : result;
		reading = false; buzzed = false; ended = true;
		
		if (result == 0) {
			$('#bottom').html('<li class="active" id="answer">Sorry! You timed out of the question.</li>');
			if (position != words.length){
				interrupts = interrupts + 1;
				negs = negs + 1;
				score = score - 4;
			}
		}
		
		else if (result == 1) {
			$('#bottom').html('<li class="active" id="answer">Sorry! Your answer was likely incorrect.</li>');
			if (position != words.length){
				interrupts = interrupts + 1;
				negs = negs + 1;
				score = score - 4;
			}
		}
		
		else {
			$('#bottom').html('<li class="active" id="answer">Your answer was correct. Good job!</li>');
			score = score + 4;
			if (position != words.length){
				interrupts = interrupts + 1;
			}
		}
		
		if (isNaN(parseInt(negs/interrupts*100))){
			ratio = String(0);
		}
		
		else{
			ratio = String(parseInt(negs/interrupts*100));
		}
		
		$('#points').html(String(score));
		$('#negs').html(String(negs));
		$('#ratio').html(ratio);
		
		$('#start').show().attr('disabled', false);
		$('#pause').show().attr('disabled', true);
		$('#resume').hide().attr('disabled', false);
		$('#buzz').hide().attr('disabled', false);
		
		$('.level21').css('width', '100%');
		$('.level22').css('width', '0%');
		
		$('.level11').css('width', '100%');
		$('.level12').css('width', '0%');
		
		if (type == 'Short Answer'){
			$('.span9').append('<div class="alert alert-success">Answer: ' + answer + '</div>');
		}
		
		else{
			$('.span9').append('<div class="alert alert-success">Answer: ' + answer + ' (' + letter + ')</div>');
		}
	}
}

$(document).ready(function() {
	$('#start').click(function() {
		ended = false; position = 0;
		$('.alert').remove()
		
		$('.bar-info').css('width', '0%');
		$('.bar-success').css('width', '100%');
		
		$.getJSON('questions.php', function(data) {
			$.each(data, function(key, val) {
				window[key] = val;
			});
		
			if (type == 'Multiple Choice') {
				words = question + 
					'<br><br>W: ' + W + 
					'<br>X: ' + X + 
					'<br>Y: ' + Y + 
					'<br>Z: ' + Z;
			}
			
			else{
				words = question;
			}
			
			$('#id').html(id + ' <span class="divider">/</span> ' + mode + ' <span class="divider">/</span> ' + type + ' <span class="divider">/</span> ' + subject + ' <span class="divider">/</span> ' + difficulty);
			$('#question').html('');
			
			$('#author').html('Author: ' + author);
			$('#uploader').html('Uploader: ' + uploader);
			
			$('#pause').attr('disabled', false);
			$('#start').attr('disabled', true);
			
			$('#start').hide();
			$('#buzz').show();
			
			read();
		});
	});
	
	$('#pause').click(function(){
		reading = false;
		$('#pause').hide().attr('disabled', true);
		$('#resume').show().attr('disabled', false);
		$('#buzz').show().attr('disabled', true);
	});
	
	$('#resume').click(function(){
		reading = true; append();
		$('#resume').hide().attr('disabled', true);
		$('#pause').show().attr('disabled', false);
		$('#buzz').show().attr('disabled', false);
	});
	
	$('#buzz').click(function(){
		$('#pause').attr('disabled', true);
			$('#buzz').attr('disabled', true);
			
			buzzed = true;
			reading = false;
			
			try	{
				clearInterval(progress);
				clearTimeout(endTimer);
			}
			
			catch (err) {
			
			}
			
			$('#answer').html('<form id="user" style="margin-bottom: 0px;" onSubmit="return false;"><div class="input-prepend"><span class="add-on">Answer</span><input style="background: inherit;" type="text" id="enter"></div><input type="submit" style="display: none;"></form>');
		
			width = $('.breadcrumb').width() - $('.add-on').width();
			width = width - 2*parseInt($('.breadcrumb').css('padding-left'));
			
			$('#enter').width(width);
			$('#enter').focus();
			
			endTimer = setTimeout(end, endTime);
			percentValue = 100;
			
			progress = setInterval(function() {
				if (percentValue > 0){
					percentValue = percentValue - 1;
					
					$('.level22').css('width', String(100 - percentValue) + '%');
					$('.level21').css('width', String(percentValue) + '%');
				}
				
				else{
					clearInterval(progress);
				}
			}, buzzTime/100);
			
			$('#user').submit(function(e){
				e.preventDefault();
				attempt = $('#enter').val().trim();

				try	{
					clearInterval(progress);
					clearTimeout(endTimer);
				}
				
				catch (err) {
				
				}

				if (type == 'Multiple Choice'){
					if (attempt.replace(/[^a-z0-9]/gi,'').toUpperCase() == letter || attempt == answer){
						end(2);
					}
					
					else{
						end(1);
					}
				}
				
				if (type == 'Short Answer'){
					if (checkAnswer(attempt, answer)){
						end(2)
					}
					
					else{
						end(1);
					}
				}
		});
	});
});