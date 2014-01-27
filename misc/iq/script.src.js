// config!
q = [
	{"q": 'LIVED is to DEVIL as 6323 is to:', "a": [
		[2336, 8],
		[6232, 3],
		[3236, 100],
		[3326, 9],
		[6332, 2]
	]},
	{"q": 'Which one of these is least like the other four?', "a": [
		['Horse', 40],
		['Kangaroo', 100],
		['Goat', 27],
		['Deer', 25],
		['Donkey', 45]
	]}
];

// code below

function rndElements(a, n){
	if(!n || a.length < n) n = a.length;
	var ret = [];
	for(var i = 0; i < n; ++i){
		if(a.length == 1){
			ret.push(a[0]);
			break;
		}
		else if(a.length){
			var ni = Math.round(Math.random() * (a.length - 1));
			ret.push(a[ni]);
			a.splice(ni, 1);
		}
	}
	return ret;
}

function to_answers(a, i){
	var ret = [];
	for(var k in a)
		ret.push('<label><input type="radio" name="q' + i + '" value="' + a[k][1] + '" />' + a[k][0] + '</label>');
	return ret.join('<br/>');
}

function addQuestions(){
	qs = rndElements(q, 2);
	for(var i = 1; i <= 2; ++i){
		document.getElementById('q' + i + 'q').innerHTML = qs[i-1].q;
		document.getElementById('q' + i + 'a').innerHTML = to_answers(rndElements(qs[i-1].a), i);
	}
	// also set the copyright year
	document.getElementById('copyyear').innerText = (new Date).getFullYear();
}

function btnValidateClicked(){
	// Process first question
	q1r = -1;
	q1o = document.getElementsByName('q1');
	q1l = q1o.length;
	for (i = 0; i < q1l; ++i) {
		if (q1o[i].checked) {
			q1r = q1o[i].value;
		}
	}
	if(q1r < 0){
		document.getElementById('resultsDiv').innerHTML = "<h1>Answer the first question</h1>";
		return;
	}
	// Process second question
	q2r = -1;
	q2o = document.getElementsByName('q2');
	q2l = q2o.length;
	for (i = 0; i < q2l; ++i) {
		if (q2o[i].checked) {
			q2r = q2o[i].value;
		}
	}
	if(q2r < 0){
		document.getElementById('resultsDiv').innerHTML = "<h1>Answer the second question</h1>";
		return;
	}
	
	// check age
	if(isNaN(parseFloat(document.getElementById('txtAge').value))){
		document.getElementById('resultsDiv').innerHTML = "<h1>Your age is essential for getting your intelligence quotient</h1>";
		return;
	}
	
	// we are GOOD!
	
	// allow reset
	document.getElementById('btnReset').disabled = false;
	// parse IQ
	iqR = (400 + parseInt(q1r, 10) + parseInt(q2r, 10)) / parseFloat(document.getElementById('txtAge').value);
	switch (true) {
		case (iqR < 20):
			iqRDetails = 'You are extremely retarded! Your IQ is less than 20!<br />"<b>Profound</b> mental retardation"';
			iqRDesc = "Profoundly Retarded!";
			iqRColor = "#FF0000";
			break;
		case (iqR >= 20 && iqR < 35):
			iqRDetails = 'You are really retarded! (IQ : 20 to 34)<br />"Severe mental retardation"';
			iqRDesc = "Severely Retarded!";
			iqRColor = "#FF0000";
			break;
		case (iqR >= 35 && iqR < 50):
			iqRDetails = 'You are retarded! (IQ : 35 to 49)<br />"Moderate mental retardation"';
			iqRDesc = "Moderately Retarded!";
			iqRColor = "#FF0000";
			break;
		case (iqR >= 50 && iqR < 70):
			iqRDetails = 'You are an idiot! You need to get smarter! (IQ : 50 to 69)<br />"Mild mental retardation"';
			iqRDesc = "Idiot!";
			iqRColor = "#FFA200";
			break;
		case (iqR >= 70 && iqR < 80):
			iqRDetails = '"Borderline intellectual functioning" (IQ : 70 to 79)';
			iqRDesc = "Enough to live";
			iqRColor = "#FFDE4";
			break;
		case (iqR >= 80 && iqR < 92):
			iqRDetails = 'Your IQ is lower than average! (IQ : 80 to 91)<br />So close to the "Borderline intellectual functioning" stage!';
			iqRDesc = "Under Average!";
			iqRColor = "#CCF600";
			break;
		case (iqR >= 92 && iqR < 115):
			iqRDetails = "Average Person (IQ : 92 to 114)";
			iqRDesc = "Average";
			iqRColor = "#007929";
			break;
		case (iqR >= 115 && iqR < 199):
			iqRDetails = "You are smart, if you didn't cheat! (IQ: 115 to 200)";
			iqRDesc = "Smart!";
			iqRColor = "#4284D3";
			break;
		case (iqR >= 199):
			iqRDetails = 'Your IQ is higher than 200, you are a absolutly, without a doubt, a genius!';
			iqRDesc = "Genius!";
			iqRColor = "#8D41D6";
			break;
	}
	// notice for "good" results
	if(iqR >= 92) iqRDetails += '<br /><b>That is, <i>unless you cheated</i>, then <u>that\'s no good is it</u>?</b>';
	// otherwise the notice for "bad" results
	else iqRDetails += '<br /><font size="3"><b>And this result may be fully accurate <i>if you truly believe it.</i></b></font>';
	iqT = '<p><font size="6">Results:</font></p><p><font size="5">Your IQ : <font color="' + iqRColor +'">' + iqR + ' </font>/&nbsp;100 (Average)</font></p>';
	iqT += '<h2> Your Rank: <font color=' + iqRColor +'>' + iqRDesc + '</font></h2>';
	iqT += '<p><font size="4">' + iqRDetails + '</font></p>';
	document.getElementById('resultsDiv').innerHTML = iqT;
}

function btnResetClicked(){
	q1o = document.getElementsByName('q1');
	q2o = document.getElementsByName('q2');
	
	q1l = q1o.length;
	for (i = 0; i < q1l; ++i) {
		q1o[i].checked = false;
	}
	
	q2l = q2o.length;
	for (i = 0; i < q2l; ++i) {
		q2o[i].checked = false;
	}
	document.getElementById('resultsDiv').innerHTML = "Results will appear here!";
	document.getElementById('btnReset').disabled = true;
}