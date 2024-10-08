function openTab(evt, tabName) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";
}

function goHome() {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById("homeContent").style.display = "block";
}


window.onload = function() {
	goHome(); // 페이지 로드 시 '홈' 탭 열기
};


function compareTexts() {
	const text1 = document.getElementById('text1').value;
	const text2 = document.getElementById('text2').value;
	const leftColor = document.getElementById('leftColor').value;
	const rightColor = document.getElementById('rightColor').value;

	const result1 = document.getElementById('result1');
	const result2 = document.getElementById('result2');

	result1.innerHTML = '';
	result2.innerHTML = '';

	const diff = Diff.diffWords(text1, text2);

	diff.forEach((part) => {
		const span1 = document.createElement('span');
		const span2 = document.createElement('span');

		if (part.added) {
			span2.style.backgroundColor = rightColor;
			span2.innerHTML = escapeHtml(part.value);
			result2.appendChild(span2);
		} else if (part.removed) {
			span1.style.backgroundColor = leftColor;
			span1.innerHTML = escapeHtml(part.value);
			result1.appendChild(span1);
		} else {
			span1.innerHTML = escapeHtml(part.value);
			span2.innerHTML = escapeHtml(part.value);
			result1.appendChild(span1);
			result2.appendChild(span2);
		}
	});
}

function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;")
		.replace(/\n/g, "<br>")
		.replace(/ /g, "&nbsp;");
}

function resetTextCompare() {
	document.getElementById("text1").value = '';
	document.getElementById("text2").value = '';
	document.getElementById("result1").innerHTML = '';
	document.getElementById("result2").innerHTML = '';
}

function splitText() {
	var text = document.getElementById("inputText").value;
	var delimiter = document.getElementById("delimiter").value || '@';
	var splitResult = text.split(delimiter).map(function(item) {
		if (item.startsWith('http://') || item.startsWith('https://')) {
			return '<a href="' + item + '" target="_blank">' + item + '</a>';
		}
		return item;
	}).join('<br>');
	document.getElementById("splitResult").innerHTML = splitResult;
}

function resetTextSplit() {
	document.getElementById("inputText").value = '';
	document.getElementById("delimiter").value = '';
	document.getElementById("splitResult").innerHTML = '';
}

function copySplitText() {
	var splitResult = document.getElementById("splitResult").textContent;
	if (!splitResult.trim()) {
		showToast("복사할 내용이 없습니다.", 'warning');
		return;
	}
	navigator.clipboard.writeText(splitResult)
		.then(() => showToast("복사되었습니다!"))
		.catch(err => showToast("복사 실패: " + err, 'warning'));
}

function combineText() {
	var text = document.getElementById("textToCombine").value;
	var delimiter = document.getElementById("combineDelimiter").value || '@';
	var combinedText = text.split('\n').join(delimiter + '');
	document.getElementById("combineResult").textContent = combinedText;
}

function resetTextCombine() {
	document.getElementById("textToCombine").value = '';
	document.getElementById("combineDelimiter").value = '';
	document.getElementById("combineResult").textContent = '';
}

function copyTextCombine() {
	var combineResult = document.getElementById("combineResult").textContent;
	if (!combineResult.trim()) {
		showToast("복사할 내용이 없습니다.", 'warning');
		return;
	}
	navigator.clipboard.writeText(combineResult)
		.then(() => showToast("복사되었습니다!"))
		.catch(err => showToast("복사 실패: " + err, 'warning'));
}




let table = [
	['Header 1', 'Header 2', 'Header 3'],
	['Row 1, Cell 1', 'Row 1, Cell 2', 'Row 1, Cell 3'],
	['Row 2, Cell 1', 'Row 2, Cell 2', 'Row 2, Cell 3']
];

function renderTable() {
	const tableContainer = document.getElementById('tableContainer');
	let html = '<table>';

	table.forEach((row, rowIndex) => {
		html += '<tr>';
		row.forEach((cell, cellIndex) => {
			if (rowIndex === 0) {
				html += `<th contenteditable="true">${cell}</th>`;
			} else {
				html += `<td contenteditable="true">${cell}</td>`;
			}
		});
		html += '</tr>';
	});

	html += '</table>';
	tableContainer.innerHTML = html;

	// 볼드 모드 이벤트 리스너 추가
	const cells = tableContainer.querySelectorAll('th, td');
	cells.forEach(cell => {
		cell.addEventListener('click', function() {
			if (document.getElementById('boldMode').checked) {
				this.classList.toggle('bold');
			}
		});
	});
}

function addRow() {
	const newRow = new Array(table[0].length).fill('');
	table.push(newRow);
	renderTable();
}

function addColumn() {
	table.forEach(row => row.push(''));
	renderTable();
}

function removeRow() {
	if (table.length > 1) {
		table.pop();
		renderTable();
	}
}

function removeColumn() {
	if (table[0].length > 1) {
		table.forEach(row => row.pop());
		renderTable();
	}
}

function tableToMarkdown() {
	let markdown = '';
	table.forEach((row, rowIndex) => {
		markdown += '| ' + row.map((cell, cellIndex) => {
			const cellElement = document.querySelector(`table tr:nth-child(${rowIndex + 1}) ${rowIndex === 0 ? 'th' : 'td'}:nth-child(${cellIndex + 1})`);
			if (cellElement && cellElement.classList.contains('bold')) {
				return `**${cell}**`;
			}
			return cell;
		}).join(' | ') + ' |\n';
		if (rowIndex === 0) {
			markdown += '| ' + row.map(() => '---').join(' | ') + ' |\n';
		}
	});
	return markdown;
}

function copyMarkdown() {
	const markdown = tableToMarkdown();
	navigator.clipboard.writeText(markdown).then(() => {
		showToast('마크다운이 클립보드에 복사되었습니다.');
	});
}

function loadMarkdown() {
	const markdownInput = document.getElementById('markdownInput');
	const markdown = markdownInput.value.trim();
	const rows = markdown.split('\n');

	table = rows.filter((row, index) => index !== 1).map(row =>
		row.split('|').slice(1, -1).map(cell => cell.trim())
	);

	renderTable();
}

document.getElementById('addRow').addEventListener('click', addRow);
document.getElementById('addColumn').addEventListener('click', addColumn);
document.getElementById('removeRow').addEventListener('click', removeRow);
document.getElementById('removeColumn').addEventListener('click', removeColumn);
document.getElementById('copyMarkdown').addEventListener('click', copyMarkdown);
document.getElementById('loadMarkdown').addEventListener('click', loadMarkdown);

document.getElementById('tableContainer').addEventListener('input', () => {
	const rows = document.querySelectorAll('tr');
	table = Array.from(rows).map(row =>
		Array.from(row.children).map(cell => cell.textContent)
	);
});

renderTable();


function resetTable() {
	table = [
		['Header 1', 'Header 2', 'Header 3'],
		['Row 1, Cell 1', 'Row 1, Cell 2', 'Row 1, Cell 3'],
		['Row 2, Cell 1', 'Row 2, Cell 2', 'Row 2, Cell 3']
	];
	renderTable();
	document.getElementById('markdownInput').value = '';
}

document.getElementById('resetTable').addEventListener('click', resetTable);




function generatePrompt() {
	var promptSelect = document.getElementById("promptSelect").value;
	var promptInputText = document.getElementById("promptInputText").value;
	var promptResult = document.getElementById("promptResult");
	navigator.clipboard.writeText(promptResult)

	if (!promptSelect) {
		showToast("프롬프트 유형을 선택하세요.", 'warning');
		return;
	}

	// <기존_텍스트> 태그 사이에 사용자가 입력한 텍스트를 삽입
	var resultText = promptSelect.replace('<기존_텍스트></기존_텍스트>', `<기존_텍스트>\n${promptInputText}\n</기존_텍스트>`);

	promptResult.innerText = resultText;
}



function resetPrompt() {
	document.getElementById("promptSelect").value = "";
	document.getElementById("promptInputText").value = "";
	document.getElementById("promptResult").innerText = "";
}

function copyPrompt() {
	var promptResult = document.getElementById("promptResult").innerText;
	if (!promptResult.trim()) {
		showToast("복사할 내용이 없습니다.", 'warning');
		return;
	}
	navigator.clipboard.writeText(promptResult)
		.then(() => showToast("복사되었습니다!"))
		.catch(err => showToast("복사 실패: " + err, 'warning'));
}



function showToast(message, type = 'success') {
	
	let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
	const toast = document.createElement('div');
	toast.className = 'toast';

	// 타입에 따라 클래스 추가
	if (type === 'success') {
		toast.classList.add('toast-success');
	} else if (type === 'warning') {
		toast.classList.add('toast-warning');
	}

	toast.textContent = message;
	document.body.appendChild(toast);

	setTimeout(() => {
		toast.classList.add('fade-out');
		toast.addEventListener('transitionend', () => toast.remove());
	}, 2000);
}

const fileInputImage = document.getElementById('file-input-image');
const image = document.getElementById('image');
const canvas = document.getElementById('canvas');
const croppedImagesContainer = document.getElementById('cropped-images-container');
const ctx = canvas.getContext('2d');
const coordinatesDisplay = document.getElementById('coordinates');
const copyButton = document.getElementById('copy-button');
const jsonOutput = document.getElementById('json-output');
const copyJsonButton = document.getElementById('copy-json-button');
const resetButton = document.getElementById('reset-button');
const undoButton = document.getElementById('undo-button');
const redoButton = document.getElementById('redo-button'); // 되돌리기 취소 버튼 추가

let startX, startY, isDrawing = false;
let rectangles = [];
let undoStack = []; // 변경 사항을 저장하는 스택
let redoStack = []; // 되돌리기 취소 스택

fileInputImage.addEventListener('change', handleFileSelect);
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawRectangle);
canvas.addEventListener('mouseup', finishDrawing);
copyButton.addEventListener('click', copyCoordinatesToClipboard);
copyJsonButton.addEventListener('click', copyJsonToClipboard);
resetButton.addEventListener('click', resetCanvas);
undoButton.addEventListener('click', undoLastAction);
redoButton.addEventListener('click', redoLastAction); // 되돌리기 취소 버튼에 이벤트 추가

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'z') {
        event.preventDefault(); // 기본 동작 방지
        undoLastAction(); // 되돌리기 함수 호출
    }
    if (event.ctrlKey && event.shiftKey && event.key === 'Z') {
        event.preventDefault(); // 기본 동작 방지
        redoLastAction(); // 되돌리기 취소 함수 호출
    }
});

function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        image.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

image.onload = function() {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
};

function startDrawing(event) {
    const rect = canvas.getBoundingClientRect();
    startX = event.clientX - rect.left;
    startY = event.clientY - rect.top;
    isDrawing = true;
}

function drawRectangle(event) {
    if (!isDrawing) return; // 드래그 중이 아니면 반환

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const width = x - startX;
    const height = y - startY;

    // 기존 좌표와 새로 그리는 사각형 모두를 그리기 위해 캔버스를 초기화합니다.
    drawRectangles(); 

    // 현재 드래그 중인 사각형을 그라디언트로 그립니다.
    const gradient = ctx.createLinearGradient(startX, startY, x, y);
    gradient.addColorStop(0, 'lime'); // 녹색
    gradient.addColorStop(1, 'blue'); // 파란색
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, width, height);
}


function finishDrawing(event) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const width = x - startX;
    const height = y - startY;

    // 좌표 정수로 변환
    const xmin = Math.floor(Math.min(startX, x));
    const ymin = Math.floor(Math.min(startY, y));
    const xmax = Math.floor(Math.max(startX, x));
    const ymax = Math.floor(Math.max(startY, y));

    const newRect = {
        x: xmin,
        y: ymin,
        width: xmax - xmin,
        height: ymax - ymin
    };

    // 현재 상태를 되돌리기 스택에 저장
    undoStack.push([...rectangles]);
    redoStack = []; // 새로운 작업이 추가되면 되돌리기 취소 스택 초기화

    rectangles.push(newRect);
    updateCoordinatesDisplay();
    updateJSONDisplay();
    updateCroppedImages();
    isDrawing = false;

    drawRectangles(); // 새 사각형 그리기
}

function undoLastAction() {
    if (undoStack.length === 0) return; // 되돌릴 내용이 없으면 반환
    redoStack.push([...rectangles]); // 현재 상태를 되돌리기 취소 스택에 저장
    rectangles = undoStack.pop(); // 스택에서 마지막 상태를 꺼내서 현재 상태로 설정

    drawRectangles(); // 사각형을 다시 그리기
    updateCoordinatesDisplay();
    updateJSONDisplay();
    updateCroppedImages();
}

function redoLastAction() {
    if (redoStack.length === 0) return; // 되돌리기 취소할 내용이 없으면 반환
    undoStack.push([...rectangles]); // 현재 상태를 되돌리기 스택에 저장
    rectangles = redoStack.pop(); // 스택에서 마지막 상태를 꺼내서 현재 상태로 설정

    drawRectangles(); // 사각형을 다시 그리기
    updateCoordinatesDisplay();
    updateJSONDisplay();
    updateCroppedImages();
}

function updateCoordinatesDisplay() {
    const coordinates = rectangles.map(r => {
        const xmin = Math.floor(r.x);
        const ymin = Math.floor(r.y);
        const xmax = Math.floor(r.x + r.width);
        const ymax = Math.floor(r.y + r.height);
        return `${xmin} ${ymin} ${xmax} ${ymin} ${xmax} ${ymax} ${xmin} ${ymax}##::`;
    }).join('\n');

    coordinatesDisplay.textContent = coordinates;
}

function updateJSONDisplay() {
    const jsonDataArray = rectangles.map(r => ({
        tag: "img",
        coords: [
            { x: r.x, y: r.y },
            { x: r.x + r.width, y: r.y },
            { x: r.x + r.width, y: r.y + r.height },
            { x: r.x, y: r.y + r.height }
        ],
        attr: {
            borderType: "None"
        }
    }));

    const jsonText = jsonDataArray.map(data => JSON.stringify(data, null, "\t")).join(",\n");

    jsonOutput.textContent = jsonText;
}

function updateCroppedImages() {
    croppedImagesContainer.innerHTML = '';

    rectangles.forEach((rect, index) => {
        const { x, y, width, height } = rect;

        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d');

        croppedCanvas.width = width;
        croppedCanvas.height = height;

        croppedCtx.drawImage(image, x, y, width, height, 0, 0, width, height);

        const container = document.createElement('div');
        container.className = 'cropped-image-container';
        
        const numberLabel = document.createElement('div');
        numberLabel.className = 'number-label';
        numberLabel.textContent = `${index + 1}`;
        
        container.appendChild(croppedCanvas);
        container.appendChild(numberLabel);
        croppedImagesContainer.appendChild(container);
    });
}

function copyCoordinatesToClipboard() {
    const coordinates = coordinatesDisplay.textContent;
    if (coordinates) {
        navigator.clipboard.writeText(coordinates)
            .then(() => showToast('좌표가 클립보드에 복사되었습니다!'))
            .catch(err => console.error('좌표 복사 실패.', err));
    } else {
        showToast('복사할 좌표가 없습니다.', 'warning');
    }
}

function copyJsonToClipboard() {
    const jsonText = jsonOutput.textContent;
    if (jsonText) {
        navigator.clipboard.writeText(jsonText)
            .then(() => showToast('JSON이 클립보드에 복사되었습니다!'))
            .catch(err => console.error('JSON 복사 실패.', err));
    } else {
        showToast('복사할 JSON 데이터가 없습니다.', 'warning');
    }
}

function resetCanvas() {
    undoStack = []; // 되돌리기 스택 초기화
    redoStack = []; // 되돌리기 취소 스택 초기화
    rectangles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateCoordinatesDisplay();
    updateJSONDisplay();
    updateCroppedImages();
    image.src = ''; 
    fileInputImage.value = ''; 
	
	canvas.width = 0;
    canvas.height = 0;
}

function initializeCanvas() {
    canvas.width = 0;
    canvas.height = 0;
}

initializeCanvas(); // 초기화 호출



let lastFileName = '';

function handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (!file) {
        // 파일 선택이 취소된 경우
        return;
    }

    // 파일 이름이 바뀌었는지 확인
    if (file.name !== lastFileName) {
        lastFileName = file.name;
        const reader = new FileReader();
        
        reader.onload = function(e) {
            image.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
        
        // 기존 데이터 초기화
        resetData();
    }
}

function resetData() {
    // Clear existing rectangles
    rectangles = [];
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 0; // Reset canvas width
    canvas.height = 0; // Reset canvas height
    
    // Clear coordinate and JSON output
    updateCoordinatesDisplay();
    updateJSONDisplay();
    updateCroppedImages();
}


const coordinatesInput = document.getElementById('coordinates-input');
const loadCoordinatesButton = document.getElementById('load-coordinates-button');

// 좌표 로드 버튼 클릭 시
loadCoordinatesButton.addEventListener('click', () => {
    const inputText = coordinatesInput.value.trim();
    if (inputText) {
        loadExistingCoordinates(inputText);
    }
});

// 기존 좌표 로드 함수
function loadExistingCoordinates(text) {
    const lines = text.split('\n');
    existingRectangles = []; // 기존 좌표 배열 초기화
    lines.forEach(line => {
        const [coordinates, label] = line.split('##::');
        if (coordinates) {
            const coords = coordinates.trim().split(' ').map(Number);
            if (coords.length === 8) {
                const [x1, y1, x2, y2, x3, y3, x4, y4] = coords;
                existingRectangles.push({ x1, y1, x2, y2, x3, y3, x4, y4 });
            }
        }
    });
    drawRectangles(); // 기존 좌표 그리기
}

// 캔버스에 사각형을 그리는 함수
function drawRectangleOnCanvas(x1, y1, x2, y2, x3, y3, x4, y4) {
    ctx.strokeStyle = 'lime'; // 형광 녹색
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.stroke();
}

let existingRectangles = []; // 기존 좌표로 그린 사각형

function drawRectangles() {
    // 캔버스를 초기화하고 이미지를 다시 그립니다.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    // 기존 좌표 사각형 그리기 (조건에 따라 표시 여부 결정)
    if (showExistingCoordinates) {
        existingRectangles.forEach(rect => {
            const x1 = Math.floor(rect.x1);
            const y1 = Math.floor(rect.y1);
            const x2 = Math.floor(rect.x2);
            const y2 = Math.floor(rect.y2);
            const x3 = Math.floor(rect.x3);
            const y3 = Math.floor(rect.y3);
            const x4 = Math.floor(rect.x4);
            const y4 = Math.floor(rect.y4);

            ctx.strokeStyle = 'orange'; // 형광 주황색
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.lineTo(x4, y4);
            ctx.closePath();
            ctx.stroke();
        });
    }

    // 새로 그린 사각형 그리기 (그라디언트)
    rectangles.forEach((r, i) => {
        const xmin = Math.floor(r.x);
        const ymin = Math.floor(r.y);
        const xmax = Math.floor(r.x + r.width);
        const ymax = Math.floor(r.y + r.height);

        const gradient = ctx.createLinearGradient(xmin, ymin, xmax, ymax);
        gradient.addColorStop(0, 'lime'); // 녹색
        gradient.addColorStop(1, 'blue'); // 파란색
        
        ctx.strokeStyle = gradient; // 그라디언트 적용
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xmin, ymin);
        ctx.lineTo(xmax, ymin);
        ctx.lineTo(xmax, ymax);
        ctx.lineTo(xmin, ymax);
        ctx.closePath();
        ctx.stroke();
        ctx.font = '12px Arial';
        ctx.fillStyle = 'lime'; // 녹색
        ctx.fillText(i + 1, xmin, ymin - 5);
    });
}

const resetExistingCoordinatesButton = document.getElementById('reset-existing-coordinates-button');
resetExistingCoordinatesButton.addEventListener('click', resetExistingCoordinates);

// 기존 좌표 초기화 함수
function resetExistingCoordinates() {
    // 기존 좌표를 저장하는 배열을 초기화
    existingRectangles = [];
    
    // 캔버스를 초기화하고 이미지를 다시 그립니다.
    drawRectangles(); 
    
    showToast('기존 좌표가 초기화되었습니다!');
}

const toggleExistingCoordinatesButton = document.getElementById('toggle-existing-coordinates-button');
let showExistingCoordinates = true; // 기본적으로 기존 좌표를 표시하도록 설정

toggleExistingCoordinatesButton.addEventListener('click', toggleExistingCoordinates);
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.code === 'Space') {
        event.preventDefault(); // 기본 동작 방지
        toggleExistingCoordinates();
    }
});

function toggleExistingCoordinates() {
    showExistingCoordinates = !showExistingCoordinates; // 현재 상태를 반전시킵니다.

    drawRectangles(); // 캔버스를 다시 그려줍니다.
    
    if (showExistingCoordinates) {
        showToast('기존 좌표가 표시됩니다.');
    } else {
        showToast('기존 좌표가 숨겨졌습니다.');
    }
}

const fileInputTxt = document.getElementById('file-input-txt');

fileInputTxt.addEventListener('change', handleTxtFileSelect);

function handleTxtFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            coordinatesInput.value = e.target.result;
        };
        reader.readAsText(file);
    }
}