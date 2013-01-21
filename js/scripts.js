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
		
		$('#start').show();
		$('#resume').show().attr('disabled', true);
		$('#buzz').hide();
		$('#pause').hide().attr('disabled', false);
		
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
		
		$('#resume').attr('disabled', false);
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
			
			$('#start').hide();
			$('#buzz').show();
			
			read();
		});
	});
	
	$('#pause').click(function(){
		if (reading == true){
			reading = false;
			$('#pause').hide();
			$('#resume').show();
		}
	});
	
	$('#resume').click(function(){
		reading = true; append();
		$('#pause').show();
		$('#resume').hide();
	});
	
	$('#buzz').click(function(){
		if (buzzed == false){
			$('#pause').attr('disabled', true);
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
					if (levenshtein(attempt, answer.toLowerCase()) < .25 * answer.length){
						end(2)
					}
					
					else{
						end(1);
					}
				}
			});
		}
	});
});