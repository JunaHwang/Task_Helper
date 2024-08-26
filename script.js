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