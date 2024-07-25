class Person {
    constructor(name, age) {
      this.name = name;
      this.age = age;
    }
    printname() {
      console.log(`This is ${this.name} with age ${this.name}`);
    }
    sayHello() {
      console.log(`Hey this is ${this.name}`);
    }
  }
  
  const aman = new Person("Aman", 12);
  const Shyam = new Person("Shyam", 15);
  console.log(aman)