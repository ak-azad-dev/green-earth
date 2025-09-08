### What is the difference between **var, let, and const**?
**var :**
- It's a functional scoped.
- We declare it inside a function, It belongs to that function.
- If we declare it in a block (if, for, etc.), it doesn’t care—it still leaks outside block.

**let :**
- Block-scoped.
- It stays inside {}, where we declare it.
- After assign a value, we can reassign it.

**const :**
- This is also block-scoped.
- After assign a value, we can’t reassign it.

### What is the difference between **map(), forEach(), and filter()**?
**map() :**
- Returns a new array `[]` with whatever we return inside the callback.

**forEach() :**
- Runs a function for every item in an array.
- Doesn’t return anything.

**filter() :**
- Returns a new array with only the items that pass a condition.

### What are arrow functions in **ES6**?
- Arrow functions are a shorter way to write functions.
- Example: `const add = (a, b) => a + b;`

### How does destructuring assignment work in **ES6**?
- Instead of pulling properties one by one, we can unpack them neatly.
- Example:
`const user = { name: "Azad", age: 25, country: "BD" };`
`const { name, age } = user;`

### Explain template literals in **ES6**. How are they different from string concatenation?
- We can build strings using backticks (`) instead of quotes. We can inject variables directly inside with ${}.
- Example:
`const name = "Azad";`
`const msg = `Hello, ${name}! Welcome Back`;`

**Concatenation :**
- Cleaner syntax.
- Multi-line strings without \n.
