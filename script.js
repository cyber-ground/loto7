'use strict';
import {console_color,console_red,console_orange,console_yellow,console_green,
	console_blue,console_purple,console_magenta,console_cyan} from './logColor.js';

// -------------------------------------------------------------------------------
//*                               --- LOTO 7 ---
// -------------------------------------------------------------------------------
//	['.9','.8','.7','.6','.5','.4','.3','.2','.1']
['e6','cc','b3','99','80','66','4d','33','1a']

document.addEventListener('DOMContentLoaded', () => {
	
const container = document.querySelector('.container');
const circleContainer = document.querySelector('.circle-container');
const targets = document.querySelectorAll('.target');
const jackpotWrapper = circleContainer.querySelector('.jackpot-wrapper');
const jackpotCircles = jackpotWrapper.querySelectorAll('.circle');
const visualContainer = container.querySelector('.visual-container');
const controlContainer = document.querySelector('.control-container');
const touchPrevent = controlContainer.querySelector('.touchPrevent'); //*
	const spacer = document.querySelector('.spacer');
	const ones = circleContainer.querySelector('.ones');
	const tens = circleContainer.querySelector('.tens');
	const twenties = circleContainer.querySelector('.twenties');
	const thirties = circleContainer.querySelector('.thirties');
		let portrait = window.matchMedia('(orientation: portrait)').matches;
		let landscape = window.matchMedia('(orientation: landscape)').matches;
	const btnQp = document.querySelector('.btnQp');
	const btnReset = document.querySelector('.btnReset');
	const counters = document.querySelectorAll('.counter');
	const btnManuals = document.querySelectorAll('.btnManual');
	const btnChange = document.querySelector('.btnChange');
	const btnSubmit = document.querySelector('.btnSubmit');
const btnDelete = document.querySelector('.btnDelete');
const btnUpload = controlContainer.querySelector('.btnUpload');
const btnDownload = controlContainer.querySelector('.btnDownload');
const iconUpload = btnUpload.querySelector('.iconUpload');
const iconDownload = btnDownload.querySelector('.iconDownload');
	let numbers, winningNumber;
	let onesArr, tensArr, twentiesArr, thirtiesArr;
	let currentStorageValue, deleteIndex, tid_btnDelete, tid_deleteAll;
	let [QP, inserted, disableManual, submittable] = [false, false, false, false];
	let [reset, selected, uploaded, download] = [false, false, false, false];
	let [deleteData, deleteAllData] = [false, false];
	let [storeCount, storeIndex, slideIndex] = [0,0,0]; 
	let [newNumbers, insertedNumbers, currentJackpotNumbers] = [[],[],[]];
	let [lastSlideIndex, storageValues, storageLength] = [[],[],[]];
	
var insertHowl = new Howl({src: ['mp3/insert.mp3'], volume: 0.2}); 
var swapHowl = new Howl({src: ['mp3/swap.mp3'], volume: 0.1}); 
var resetHowl = new Howl({src: ['mp3/reset.mp3'], volume: 0.2}); 
var slideHowl = new Howl({src: ['mp3/slide.mp3'], volume: 0.1}); 
var uploadHowl = new Howl({src: ['mp3/upload.mp3'], volume: 0.05}); 
var downloadHowl = new Howl({src: ['mp3/download.mp3'], volume: 0.02}); 
var callDeleteHowl = new Howl({src: ['mp3/callDelete.mp3'], volume: 0.3}); 
var callDeleteAllHowl = new Howl({src: ['mp3/callDeleteAll.mp3'], volume: 0.03}); 
var deleteHowl = new Howl({src: ['mp3/delete.mp3'], volume: 0.2}); 
var deleteAllHowl = new Howl({src: ['mp3/deleteAll.mp3'], volume: 0.1}); 
var undoHowl = new Howl({src: ['mp3/undo.mp3'], volume: 0.2}); 
var faultHowl = new Howl({src: ['mp3/fault.mp3'], volume: 0.2});

function init() {
	if(portrait) { setCircleNumber()}
	animateStars();
	storeCount = localStorage.getItem('lastStoreCount');
	storageLength = [localStorage.length - 1];
	for (let i = 1; i < localStorage.length; i++) {
		let v = localStorage.getItem(`storeNumber-${i}`)
		storageValues.push(v);
	}
	document.addEventListener('contextmenu', e => e.preventDefault());
	container.addEventListener('click', e => e.preventDefault());
	touchPrevent.addEventListener('touchstart', e => e.preventDefault());
	counters.forEach(counter => 
		counter.addEventListener('touchstart', e => e.preventDefault()));
} init();


//* btnUpload ----------------------------------------------------

btnUpload.addEventListener('touchstart', (e) => {
	if(QP && !selected && !uploaded && !download) {
		uploadHowl.play();
		iconUpload.style.color = '#0f0';
		[currentJackpotNumbers, storageLength] = [[],[]];
		saveData();
		flashActiveCircles();
		storeCount++;
		localStorage.setItem('lastStoreCount', storeCount);
		localStorage.setItem(`storeNumber-${storeCount}`, currentJackpotNumbers);
		storageValues.push(currentJackpotNumbers);
		storageLength.push(storeCount);
		uploaded = true;
	}
	btnUpload.classList.add('active'); 
	if(download) {
		if(!btnDelete.classList.contains('active')) 
			{ iconUploadCallDelete(); e.preventDefault()}
		tid_btnDelete = setTimeout(() => {
			if(btnUpload.classList.contains('active')) {
				callDeleteHowl.play();
				btnDelete.classList.add('active');
				resetIconUpload();
			}
		}, 1000);
	}
});

btnUpload.addEventListener('touchend', () => {
	clearTimeout(tid_btnDelete);
	btnUpload.classList.remove('active');
	btnUpload.style.scale = 'initial';
	iconUpload.style.color = '';
	if(download && !btnDelete.classList.contains('active')) {
		iconUpload.style.color = '#ff000099';
	}
});

function iconUploadCallDelete() {
	iconUpload.style.color = '#f00';
	btnUpload.style.transition = 'scale .3s';
	btnUpload.style.scale = 1.4;
	btnUpload.style.zIndex = 100;
}

function resetIconUpload() {
	iconUpload.classList.remove('fa-xmark');
	iconUpload.classList.add('fa-cloud-arrow-up');
	iconUpload.style.color = '';
}

function flashActiveCircles() {
	const activeCircles = circleContainer.querySelectorAll('.activeCircle');
	activeCircles.forEach(activeCircle => {
		if(activeCircle.textContent <= 37) {
			activeCircle.style.backgroundColor = '#c14fffe6';
		}
		if(activeCircle.textContent <= 29) {
			activeCircle.style.backgroundColor = '#ffd000e6';
		}
		if(activeCircle.textContent <= 19) {
			activeCircle.style.backgroundColor = '#00B2FFe6';
		}
		if(activeCircle.textContent <= 9) {
			activeCircle.style.backgroundColor = '#FF6F00e6';
		}
		setTimeout(() => {activeCircle.style.backgroundColor = ''}, 200);
	});
}

//* btnDownload ----------------------------------------------------

btnDownload.addEventListener('touchstart', () => {
	if(!localStorage.hasOwnProperty('lastStoreCount')) return;
	if(localStorage.getItem('lastStoreCount') === '0') return;
	if(btnSubmit.classList.contains('activate')) return; 
	if(download && storageLength[0] === 1) return; 
	if(!QP && !inserted || download) { 
		downloadHowl.play();
		iconDownload.style.color = '#0f0';
		btnDownload.classList.add('active');
		[currentStorageValue, deleteIndex] = [[],[]];
		if(!btnDelete.classList.contains('active')) {
			swapIconUpload('fa-cloud-arrow-up','fa-xmark','#ff000099');
		}
		if(storeIndex === localStorage.length - 1) {storeIndex = 0}
		storeIndex++;
		const storeNumber = localStorage.getItem(`storeNumber-${storeIndex}`).split(',');
		deleteIndex.push(storeIndex);
		storeNumber.map(num => { currentStorageValue.push(num)});
		restoreLocalStorageData();
		[QP, download] = [true, true];
		btnQp.classList.add('inactivate');
		btnReset.classList.add('activate');
		btnManuals.forEach(btnManual => { btnManual.classList.add('inactive')});
		deactivateStars();
	}
});

function swapIconUpload(classNameRemove, classNameAdd, color) {
	iconUpload.classList.remove(classNameRemove);
	iconUpload.classList.add(classNameAdd);
	iconUpload.style.color = color;
}

function deleteStoreData() {
	localStorage.removeItem(`storeNumber-${deleteIndex[0]}`);
	storageValues.splice((deleteIndex[0] - 1), 1);
	let storeNumber;
	setTimeout(() => {
		localStorage.clear();
		storeCount = storeCount-1;
		localStorage.setItem('lastStoreCount', storeCount);
		for (let i = 0; i < storageValues.length; i++) {
			localStorage.setItem(`storeNumber-${[i+1]}`, storageValues[i])}
		setTimeout(() => {
			if(localStorage.getItem('lastStoreCount') === '0') {
				storageLength = [storeCount]; resetAll(); activateStars(); return}
			if(deleteIndex[0] === storageLength[0]) {
				storeNumber = localStorage.getItem(`storeNumber-1`).split(',');
				storeIndex = 1; deleteIndex = [storeIndex]; 
			} else { storeNumber = localStorage.getItem(`storeNumber-${storeIndex}`).split(',')}
			currentStorageValue = [];
			storeNumber.map(num => { currentStorageValue.push(num)});
			restoreLocalStorageData();
			storageLength = [storeCount];
			if(storageLength[0] === 1) { iconDownload.style.color = ''}
			downloadHowl.play();
			deleteData = false;
		}, 500); //* bc1000
	}, 300); //* bc500
}

function restoreLocalStorageData() { 
	resetCirclesNumber();
	if(portrait) {
		setCircleNumber();
		assignWinningNumber(currentStorageValue);
	} else if(landscape) { insertJackpotNumbers(currentStorageValue)}
}

btnDownload.addEventListener('touchend', () => {
	if(storageLength[0] > 0 && download) {
		iconDownload.style.color = '';
	} 
	if(storageLength[0] > 1 && download) {
		iconDownload.style.color = '#00ff0099';
	} 
	btnDownload.classList.remove('active');
});


//* btnDelete ----------------------------------------------------

btnDelete.addEventListener('click', () => {
	if(!deleteData && !deleteAllData) {
		deleteData = true;
		flashActiveCircles();
		setTimeout(() => { deleteHowl.play()}, 100);
		deleteStoreData();
		setIconDownloadColor();
		if(storageLength[0] === 1) {
			iconDownload.style.color = '';
		}
	}
	if(deleteAllData) {
		deleteAllHowl.play();
		localStorage.clear();
		storeCount = 0;
		localStorage.setItem('lastStoreCount', storeCount);
		[storageLength, storageValues] = [[],[]];
		resetAll();
		animateStars();
	}
});

btnDelete.addEventListener('touchstart', (e) => {
	if(!deleteData && !deleteAllData) {
		btnDelete.style.backgroundColor = '#333333';
		btnDelete.style.color = '#f00';
		tid_deleteAll = setTimeout(() => {
			e.preventDefault();
			btnDelete.style.width = 90 +'px';
			btnDelete.style.color = '#333';
			btnDelete.style.backgroundColor = '#ff0000e6';
			setTimeout(() => {
				let fadeId = callDeleteAllHowl.play(); 
				callDeleteAllHowl.fade(0.3, 0, 550, fadeId);
			}, 200);
			deleteAllData = true;
		}, 2000);
	}
});

btnDelete.addEventListener('touchend', () => {
	clearTimeout(tid_deleteAll);
	if(!deleteAllData) {
		btnDelete.style.backgroundColor = '';
		btnDelete.style.color = '';
		btnDelete.style.width = '';
	}
});

function setIconDownloadColor() {
	iconDownload.style.color = 
	storageLength[0] > 0 ? '#00ff0099' : '';
}


//* resize event ----------------------------------------------------

window.addEventListener('resize', () => {
	portrait = window.matchMedia('(orientation: portrait)').matches;
	landscape = window.matchMedia('(orientation: landscape)').matches;
	currentJackpotNumbers = [];
	saveData();
	detectViewportSize();
	restoreData();
});


//* ----------------------------------------------------

function setCircleNumber() {
	const circles = document.querySelectorAll('.circle');
	circles.forEach((circle, i) => { circle.textContent = i+1});
} 

function saveData() {
	const activeCircles = document.querySelectorAll('.activeCircle');
	activeCircles.forEach(activeCircle => {
		currentJackpotNumbers.push(activeCircle.textContent);
		currentJackpotNumbers.sort((a, b) => { return a - b }); 
	});
}

function restoreData() { //* restore activeCircle selected
	resetCirclesNumber();
	if(portrait) {
		setCircleNumber();
		assignWinningNumber(currentJackpotNumbers);
	} else if(landscape) { insertJackpotNumbers(currentJackpotNumbers)}
	const activeCircles = document.querySelectorAll('.activeCircle');
	let idx = lastSlideIndex[0]; 
	if(lastSlideIndex.length !== 0) { 
		activeCircles[idx].classList.add('selected');
	}
}

	function resetAll() {
		resetCirclesNumber();
		if(portrait) { setCircleNumber()}
		btnManuals.forEach(btnManual => {
			btnManual.classList.remove('inactive','selected');
		});
		counters.forEach(counter => {
			counter.classList.remove('active','inactive');
			counter.textContent = counter.dataset.num;
		});
		btnQp.classList.remove('inactivate'); 
		btnReset.classList.remove('activate');
		btnSubmit.classList.remove('activate');
		btnDelete.classList.remove('active');
		btnDelete.style.backgroundColor = '';
		btnDelete.style.color = '';
		btnDelete.style.width = '';
		btnChange.classList.remove('activate','arrowAppear','swapBgColor');
		btnChange.textContent = btnChange.dataset.text;
		[newNumbers, insertedNumbers, currentJackpotNumbers, lastSlideIndex] = [[],[],[],[]];
		[submittable, QP, inserted, disableManual] = [false, false, false, false]; 
		[uploaded, download, deleteData, deleteAllData] = [false, false, false, false];
		[reset, selected] = [false, false];
		[storeIndex, slideIndex] = [0,0]; 
		resetIconUpload();
		setIconDownloadColor();
	}


	function detectViewportSize() {
		if(portrait) {
			jackpotCircles.forEach(circle => { circle.classList.remove('landscape')});
			targets.forEach(target => { target.style.display = 'flex'});
			jackpotWrapper.classList.remove('landscape'); 
			controlContainer.classList.remove('active');
			spacer.classList.remove('viewportSmall', 'viewportLarge');
			visualContainer.classList.remove('viewportSmall','viewportLarge','landscape');
		} 
		if(landscape) {
			jackpotCircles.forEach(circle => { circle.classList.add('landscape')});
			targets.forEach(target => { target.style.display = 'none'});
			jackpotWrapper.classList.add('landscape'); 
			controlContainer.classList.add('active');
			controlContainer.classList.remove('viewportLarge'); 
			visualContainer.classList.remove('largeViewport','portrait');
		} 
		detectMenubarStatus_horizontal();
		detectMenubarStatus_vertical();
		activateStars();
		if(!QP && !inserted && !submittable) { setIconDownloadColor()}
	} detectViewportSize();


	function animateStars() {
		const stars = document.querySelectorAll('.fa-star');
		stars.forEach((star, index) => { 
			star.classList.remove('animate');
			star.style.animationDuration = 1 + 's';
			star.style.animationDelay = index * .5 + 's';
			star.classList.add('animate');
		});
	}

function activateStars() {
	if(download || QP || submittable) return;
	animateStars();
}

function deactivateStars() {
	const stars = document.querySelectorAll('.fa-star');
	stars.forEach(star => { star.classList.remove('animate')});
}

	function detectMenubarStatus_horizontal() {
		if(landscape && innerHeight > 349) { 
			spacer.classList.remove('viewportSmall');
			spacer.classList.add('viewportLarge');
			visualContainer.classList.remove('viewportSmall','landscape');
			visualContainer.classList.add('viewportLarge','landscape');
		} else if(landscape && innerHeight < 349) {
			spacer.classList.remove('viewportLarge');
			spacer.classList.add('viewportSmall');
			visualContainer.classList.remove('viewportLarge','landscape');
			visualContainer.classList.add('viewportSmall','landscape');
		}	
	}

	function detectMenubarStatus_vertical() {
		if(portrait && innerHeight > 719) { //*large
			circleContainer.classList.add('viewportLarge');
			controlContainer.classList.add('viewportLarge');
			visualContainer.classList.add('largeViewport','portrait');
			const activeCircles = document.querySelectorAll('.activeCircle');
			activeCircles.forEach(activeCircle => {
				activeCircle.classList.add('largeViewport');
			});
		} else if(portrait && innerHeight < 720) { //*small //real610px
			circleContainer.classList.remove('viewportLarge');
			controlContainer.classList.remove('viewportLarge');
			visualContainer.classList.remove('largeViewport','portrait');
			const activeCircles = document.querySelectorAll('.activeCircle');
			activeCircles.forEach(activeCircle => {
				activeCircle.classList.remove('largeViewport');
			});
		}	
	} 


//* btnReset -------------------------------------------------------------

btnReset.addEventListener('click', () => {
	if(QP && !deleteData || inserted && !deleteData || submittable) {
		reset = true;
		if(reset && !selected) { resetHowl.play(); resetAll(); activateStars()} 
		const activeCircles = document.querySelectorAll('.activeCircle');
		if(selected) {
			counters.forEach(counter => { 
				counter.classList.remove('active'); 
				if(activeCircles.length === 7) { 
					deactivateStars();
					counter.classList.add('inactive'); 
				}
				counter.textContent = counter.dataset.num;
			});
			resetModifiedBtns();
			iconUpload.style.color = '#00ff0099';
			undoHowl.play();
			btnManuals.forEach(btnManual => { btnManual.classList.remove('selected')});
			if(activeCircles.length === 7) {
				btnManuals.forEach(btnManual => { btnManual.classList.add('inactive')});
				disableManual = true;
			} else { disableManual = false}
			activeCircles.forEach(activeCircle => { activeCircle.classList.remove('selected')});
			lastSlideIndex = []; 
			slideIndex = 0; 
			selected = false;
			if(inserted) { animateStars()}
		}
	}
});

//* btnQp -------------------------------------------------------------

btnQp.addEventListener('click', () => {
	if(!QP && !inserted && !submittable) {
		if(portrait) { assignWinningNumber(winningNumber)} 
		else { insertJackpotNumbers(winningNumber)}
		deactivateStars(); 
		insertHowl.play(); storeIndex = 0; //*
		[QP, disableManual] = [true, true]; 
		iconUpload.style.color = '#00ff0099'; 
		iconDownload.style.color = ''; 
		btnManuals.forEach(btnManual => {
			btnManual.classList.remove('selected','activate');
			btnManual.classList.add('inactive');
		});
		counters.forEach(counter => {
			counter.classList.remove('active');
			counter.classList.add('inactive');
			counter.textContent = counter.dataset.num;
		});
		btnQp.classList.add('inactivate'); 
		btnChange.classList.add('activate');
		btnReset.classList.add('activate');
		btnSubmit.classList.remove('activate');
	}
});


//* btnChange -------------------------------------------------------------

btnChange.addEventListener('click', () => {
	if(QP && !download || inserted && !download) {
		if(QP) { animateStars()} 
		selected = true;
		disableManual = false;
		newNumbers = [];
		const activeCircles = document.querySelectorAll('.activeCircle');
		let activeCircleLength = activeCircles.length;
		iconUpload.style.color = ''; 
		btnReset.textContent = 'UNDO'; 
		btnChange.classList.remove('activate');
		btnChange.classList.add('swapBgColor');
		btnChange.textContent = '';
		if(inserted && activeCircleLength <= 1) {
			btnChange.classList.add('arrowAppear'); 
			btnChange.classList.add('single'); 
		} else { 
			btnChange.classList.remove('single');
			btnChange.classList.add('arrowAppear');
		}
		btnManuals.forEach(btnManual => { btnManual.classList.remove('inactive')});
		counters.forEach(counter => { counter.classList.remove('inactive')});
		// * arrowAppear
		if(btnChange.classList.contains('arrowAppear')) {
			slideHowl.play();
			activeCircles.forEach(activeCircle => { activeCircle.classList.remove('selected')}); //*>
			activeCircles[slideIndex].classList.add('selected'); //*>
			lastSlideIndex = []; 
			lastSlideIndex.push(slideIndex);
			slideIndex++; 
			if(slideIndex > activeCircleLength -1) { slideIndex = 0} 
		}
	}
});


//* btnSubmit -------------------------------------------------------------

btnSubmit.addEventListener('click', () => {
	const activeCircles = document.querySelectorAll('.activeCircle');
	abortDuplicateNumber(activeCircles);
	if(!QP && submittable) { //*** inserted one by one *** //
		insertSelectedNumber(activeCircles);
		setTimeout(() => {
			resetCirclesNumber();
			insertHowl.play();
			insertedNumbers.sort((a, b) => { return a - b});
			if(portrait) { setCircleNumber(); assignWinningNumber(insertedNumbers)}
			if(landscape) { insertJackpotNumbers(insertedNumbers)}
			inserted = true;
			resetModifiedBtns();
			btnManuals.forEach(btnManual => { btnManual.classList.remove('selected')});
			lastSlideIndex = []; slideIndex = 0;
			[selected, submittable] = [false, false];
			activateStars();  
			if(insertedNumbers.length === 7) { 
				btnManuals.forEach(btnManual => { btnManual.classList.add('inactive')});
				iconUpload.style.color = '#00ff0099'; 
				deactivateStars(); 
				[disableManual, QP] = [true, true];
			} else { QP = false}
		}, 100);
	}	//*** inserted one by one *** //

	if(submittable && QP && !download) { //*** completed 7 number *** //
		insertModifiedNumber(activeCircles);
		currentJackpotNumbers = [];
		newNumbers.sort((a, b) => { return a - b }); 
		currentJackpotNumbers = newNumbers;
		iconUpload.style.color = '#00ff0099';
		resetModifiedBtns();
		deactivateStars(); 
		insertHowl.play(); 
		btnManuals.forEach(btnManual => {
			btnManual.classList.remove('selected'); 
			btnManual.classList.add('inactive'); 
		});
		setTimeout(() => {
			resetCirclesNumber();
			if(portrait) { setCircleNumber();
				assignWinningNumber(newNumbers);
			} else if(landscape) { insertJackpotNumbers(newNumbers)}
		}, 100);
		disableManual = true; 
		lastSlideIndex = []; slideIndex = 0;
		[submittable, selected, uploaded] = [false, false, false];
	} //*** completed 7 number *** //
});

function abortDuplicateNumber(activeCircles) {
	activeCircles.forEach(activeCircle => {
		counters.forEach(counter => { 
			if(counter.classList.contains('active') 
				&& counter.textContent === activeCircle.textContent) {
				submittable = false; faultHowl.play();
			}
		});
	});
}

function resetModifiedBtns() {
	btnChange.classList.remove('arrowAppear', 'swapBgColor');
	btnChange.classList.add('activate');
	btnChange.textContent = btnChange.dataset.text;
	btnReset.textContent = btnReset.dataset.text;
	btnSubmit.classList.remove('activate');
}

//*** inserted one by one -------
	function insertSelectedNumber(activeCircles) { 
		counters.forEach(counter => { 
			if(counter.classList.contains('active')) {
				insertedNumbers.push(counter.textContent);
				counter.classList.remove('active'); 
			}
			counter.textContent = counter.dataset.num;
			if(activeCircles.length >= 6) { counter.classList.add('inactive')}
		});
		activeCircles.forEach((activeCircle, i) => {
			if(activeCircle.classList.contains('selected')) {
				insertedNumbers.filter(num => {
					if(num === activeCircle.textContent) { insertedNumbers.splice(i, 1)}
				});
			}
		});
	}

//*** completed 7 number -------
	function insertModifiedNumber(activeCircles) {
		pushCurrentActiveCircleNum(activeCircles);
		pushSelectedCounterNum();
		deleteDuplicateNum(activeCircles);
	}

	function pushCurrentActiveCircleNum(activeCircles) {
		activeCircles.forEach(activeCircle => {
			if(activeCircle.classList.contains('activeCircle')) { 
				newNumbers.push(activeCircle.textContent);
			} 
		});
	}

	function pushSelectedCounterNum() {
		counters.forEach(counter => { 
			if(counter.classList.contains('active')) {
				newNumbers.push(counter.textContent);
				counter.classList.remove('active'); 
			}
			counter.textContent = counter.dataset.num;
			counter.classList.add('inactive'); 
		});
	}

	function deleteDuplicateNum(activeCircles) {
		activeCircles.forEach((activeCircle, i) => {
			if(activeCircle.classList.contains('selected')) {
				newNumbers.filter(num => {
					if(num === activeCircle.textContent) { newNumbers.splice(i, 1)}
				});
			}
		});
	}


//* btnManuals -------------------------------------------------------------

btnManuals.forEach((btnManual, index) => { 
	btnManual.addEventListener('click', () => {
		if(!disableManual && !download) {
			swapHowl.play();
			btnQp.classList.add('inactivate'); 
			iconDownload.style.color = ''; 
			btnReset.classList.add('activate'); 
			animateStarsModified(index);
			rotateCounterNumber(btnManual, index); //*>
			btnManuals.forEach(btnManual=> { btnManual.classList.remove('selected')}); //*>
			btnManual.classList.add('selected'); //*> absolute pos
			btnSubmit.classList.add('activate');
			submittable = true; 
		}
	});
});

function animateStarsModified(index) {
	const stars = document.querySelectorAll('.star');
	stars.forEach(star => { star.classList.remove('animate')}); 
	setTimeout(() => {
		stars.forEach((star, idx) => { 
			if(index === idx) {
				star.style.animationDelay = 0 + 's';
				star.style.animationDuration = 2 + 's';
				star.classList.add('animate'); 
			}
		});
	}, 100);
}

function rotateCounterNumber(btnManual, index) {
	const counters = document.querySelectorAll('.counter');
	counters.forEach((counter, i) => {
		counter.classList.remove('active'); //*>
		if(index === i) {
			counter.classList.add('active'); //*>
			if(counter.classList.contains('active') 
				&& btnManual.classList.contains('selected')) {
				counter.textContent = parseFloat(counter.textContent) + 1;
				if(i === 0 && parseFloat(counter.textContent) > 9) {
					counter.textContent = 1;
				}
				const rotateNum = parseFloat(counter.textContent.slice(-1));
				if(i !== 0 && rotateNum === 0) {
					counter.textContent = parseFloat(counter.textContent) - 10;
				}
				if(i === 3 && rotateNum > 7) {
					counter.textContent = parseFloat(counter.textContent) - 8;
				}
			}
		} else { counter.textContent = counter.dataset.num }
	});
}


//* ------------------------------------------------------------------------

function createWinningNumber() {
	[numbers, winningNumber] = [[],[]];
		for (let i = 0; i < 37; i++) { numbers[i] = i + 1}
		for (let i = 0; i < 7; i++) { 
			if(i % 2 === 1) { numbers.sort(() => { return 0.5 - Math.random()})}
			winningNumber[i] = numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0];
		}
		winningNumber.sort((a, b) => { return a - b }); 
} createWinningNumber();
// console.log('first', winningNumber); //* log


function assignWinningNumber(arg) {
	[onesArr, tensArr, twentiesArr, thirtiesArr] = [[],[],[],[]];
	arg.map(num => {
		if(num <= 9) {
			onesArr.push(num);
			insertWiningNumbers(onesArr, ones); 
		}
		if(num >= 10 && num <= 19) {
			tensArr.push(num);
			insertWiningNumbers(tensArr, tens);
		}
		if(num >= 20 && num <= 29) {
			twentiesArr.push(num);
			insertWiningNumbers(twentiesArr, twenties);
		}
		if(num >= 30 && num <= 37) {
			thirtiesArr.push(num);
			insertWiningNumbers(thirtiesArr, thirties);
		}
	});
	createWinningNumber(); //* for next
	// console.log('next', winningNumber); //* log
}

	function insertWiningNumbers(arr, elem) {
		const circles = elem.querySelectorAll('.circle');
		for (let i = 0; i < circles.length; i++) {
			arr.filter(n => {
				if(circles[i].textContent === String(n)) {
					circles[i].classList.add('activeCircle');
				}
			})
		}
	}

	function insertJackpotNumbers(arg) { //* horizontal viewport
		arg.map((num, index) => {
			jackpotCircles[index].textContent = num;
			jackpotCircles[index].classList.add('activeCircle');
		});
		assignCirclesColor();
		createWinningNumber(); //* for next
		// console.log('landscape next', winningNumber); //* log
	}


	function resetCirclesNumber() {
		const circles = document.querySelectorAll('.circle');
		circles.forEach(circle => {
			circle.textContent = '';
			circle.classList.remove('activeCircle', 'selected');
			circle.classList.remove('ones','tens','twenties','thirties');
		});
	}


function assignCirclesColor() {
	const circles = circleContainer.querySelectorAll('.circle');
	circles.forEach(circle => {
		if(parseFloat(circle.textContent) <= 9) {	
			circle.classList.add('ones');
		}
		if(parseFloat(circle.textContent) >= 10 
		&& parseFloat(circle.textContent) <= 19) {
			circle.classList.add('tens');
		}
		if(parseFloat(circle.textContent) >= 20 
		&& parseFloat(circle.textContent) <= 29) {
			circle.classList.add('twenties');
		}
		if(parseFloat(circle.textContent) >= 30 
		&& parseFloat(circle.textContent) <= 37) {
			circle.classList.add('thirties');
		}
	});
}

});
// -------------------------------------------------------------------------------
//* ---------------------------------------

	// const lenis = new Lenis();
	// function raf(time) {
	// 	lenis.raf(time/3);
	// 	requestAnimationFrame(raf);
	// }
	// requestAnimationFrame(raf);

	// // lenis.stop();
	// // lenis.start();

//* ---------------------------------------
// -------------------------------------------------------------------------------
		// let storageKeys = [];
		// Object.keys(localStorage).forEach(key => { 
		// 	if(key.includes('chose keyName')) {
		// 		if(!storageKeys.includes(key)) {
		// 			storageKeys.push(key);
		// 			storageKeys.sort();
		// 		}
		// 	} 
		// });


// -------------------------------------------------------------------------------

























