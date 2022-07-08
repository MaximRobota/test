# Test Editor

### Task
Написати програму що використовує паттерни Обсервер, Команда i Мементо, та відповідає наступним умовам:
1) Зберігає в пам'яті масив параграфів наступного типу
```
interface Paragraph{
    id: string;
    text: string;
    color: string;
}
```
2) Виводить всі параграфи на екран, відображаючи вміст кожного параграфу згідно шаблону
```
 <p style="color:{{paragraph.color}}">{{paragraph.text}}<p>
 ```

3) Через консоль розробника надає наступне API:
```
interface Paragraphs{
    insert(p: Paragraph): void;
    remove(id: string): void;
    update(id: string: p: Paragraph): void;
    undo(): void;
    redo(): void;
}
```
4) Оновлює екран при зміні масиву параграфів.


### Start
    npm i
    npm run start
### Build
    npm run build
    npm run build:dev

### Plan
- [x] Simply in JS (see the code in the folder: ./legacy)
- [x] Simply in TS with ESBuild
- [ ] Tests