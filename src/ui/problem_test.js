export class Problem {
  constructor(text, placeholder, solution) {
    // ui
    this.div = document.createElement('div');
    this.div.classList.add('problem');

    const statement = document.createElement('p');
    statement.classList.add('statement');
    statement.textContent = text;

    this.inputBox = document.createElement('input');
    this.inputBox.type = 'text';
    this.inputBox.placeholder = placeholder;

    this.dialog = document.createElement('p');
    this.dialog.classList.add('dialog');

    this.div.appendChild(statement);
    this.div.appendChild(this.inputBox);
    this.div.appendChild(this.dialog);

    this.solution = solution
    this.solution_found = false
    this.closed = false

    const close = () => {
      this.closed = true
      this.div.remove()
    }

    document.querySelector('body').appendChild(this.div)

    if (window.MathJax) {
      MathJax.typesetPromise([statement])
    }

    this.inputBox.addEventListener('keypress', () => {
      if (this.inputBox.value.trim().toLowerCase() == solution.trim().toLowerCase()) {
        this.solution_found = true
        close()
      }
    })

    document.addEventListener('keypress', (e) => {
      if (e.key == 27) {
        close()
      }
    })

  }
}
