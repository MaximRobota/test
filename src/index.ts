interface Paragraph{
    id: string;
    text: string;
    color: string;
}

class Paragraphs {
    content = document.getElementById('content') as HTMLDivElement;
    undo = document.getElementById('undo') as HTMLButtonElement;
    redo = document.getElementById('redo') as HTMLButtonElement;
    editorHistory = [[]];
    historyIndex = 0;

    constructor() {
        this.reload();

        this.undo.addEventListener('click', () => {
            if (this.historyIndex > 0) {
                this.historyIndex--;
            }
            this.reload();
        });
        this.redo.addEventListener('click', () => {
            if (this.historyIndex < this.editorHistory.length) this.historyIndex++;
            this.reload();
        });
    }

    operation(fn) {
        this.editorHistory = this.editorHistory.slice(0, this.historyIndex + 1);
        const newVersion = fn(this.editorHistory[this.historyIndex]);
        this.historyIndex++;
        this.editorHistory.push(newVersion);
        this.reload();
    }

    insert(paragraph: Paragraph): void {
        this.operation((data) => {
            const newVersion = data.slice();
            newVersion.push({
                id: paragraph.id,
                color: paragraph.color,
                text: paragraph.text
            });
            return newVersion;
        });
    }

    remove(id: string): void {
        this.operation((data) => data.filter((paragraph) => paragraph.id !== id));
    }

    update(id: string, paragraph:Paragraph): void {
        this.operation((data) => {
            const newVersion = data.slice();
            return newVersion.map((x, index) => x.id === id ? newVersion[index] = paragraph : x);
        });
    }

    reload() {
        this.content.innerHTML = '';
        this.editorHistory[this.historyIndex].forEach((paragraph: Paragraph) => {
            const elem = this.content.appendChild(document.createElement('p'));
            elem.style.color = paragraph.color;
            elem.innerHTML = paragraph.text;
        });

        this.undo.disabled = (this.historyIndex !== 0) ? '' : 'disabled';
        this.redo.disabled = (this.historyIndex !== this.editorHistory.length - 1) ? '' : 'disabled';
    }
}

const Editor = new Paragraphs();
// Test:
console.log(Editor.editorHistory);
setTimeout(() => {
    Editor.insert({id: '1', text: 'Text 1', color: 'green' })
    console.log(Editor.editorHistory);
}, 1000);
setTimeout(() => {
    Editor.insert({id: '2', text: 'Text 2', color: 'red' })
    console.log(Editor.editorHistory);
}, 2000);
setTimeout(() => {
    Editor.insert({id: '3', text: 'Text 3', color: 'green' })
    console.log(Editor.editorHistory);
}, 3000);
setTimeout(() => {
    Editor.update('2', {id: '4', text: 'Text 4', color: 'green' })
    console.log(Editor.editorHistory);
}, 4000);
setTimeout(() => {
    Editor.remove('3')
    console.log(Editor.editorHistory);
}, 5000);

