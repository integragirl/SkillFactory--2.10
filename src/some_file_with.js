const header = new Headers({
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*'
})

const progress_cats 	= document.querySelector('#pb-cats')
const progress_dogs 	= document.querySelector('#pb-dogs')
const progress_parrots 	= document.querySelector('#pb-parrots')

console.log('load')

var btn = document.querySelectorAll('.btn');

[].forEach.call( btn, function(el) {
	el.onclick = function() { post_voting_result(this.id); }
});

document.querySelector('#voting_result').hidden = true


function post_voting_result(current_vote) {	

	const request = new XMLHttpRequest();
	function reqReadyStateChange() {
	    if (request.readyState == 4 && request.status == 200) {
	        console.log(request)
	        ret_result()
	    }
	};
	var body = "";
	request.open("POST", "https://sf-pyw.mosyag.in/sse/vote/"+current_vote);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	request.onreadystatechange = reqReadyStateChange;
	request.send(body);

}

function ret_result() {	

	document.querySelector('#voting_result').hidden = false
	document.querySelector('#voting_button').hidden = true

	const url = new URL('https://sf-pyw.mosyag.in/sse/vote/stats')

	const ES = new EventSource(url, header)

	ES.onerror = error => {
	    ES.readyState ? progress.textContent = "Some error" : null;
	}

	ES.onmessage = ({ data }) => {

		data_j = JSON.parse(data)

	    progress_cats.style.cssText = `width: ${data_j.cats*100/10000}%`
	    progress_cats.textContent = `${data_j.cats}`

	    progress_dogs.style.cssText = `width: ${data_j.dogs*100/10000}%`
	    progress_dogs.textContent = `${data_j.dogs}`

	    progress_parrots.style.cssText = `width: ${data_j.parrots*100/10000}%`
	    progress_parrots.textContent = `${data_j.parrots}`

	};

}
