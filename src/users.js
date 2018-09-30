class Users {
  constructor() {
    this.users = [];
    this.tasks = [];
    this.activeTask = '';
  }

  addUser(id,name,room,isSM){
    const color = '#'+Math.random().toString(16).slice(2, 8).toUpperCase();
    this.users.push({id,name,room,isSM,color})
    return {id,name,room,isSM,color};
  }
  removeUser(id){
		let removedUserIndex = this.users.findIndex((user)=>{return user.id === id})
    console.log('removed user index ',removedUserIndex);
    if(removedUserIndex === -1){return undefined;}
    let removedUser = this.users[removedUserIndex];
    this.users.splice(removedUserIndex,1);
    return removedUser
  }
  getUser(id){
    return this.users.find((user) => {
      return user.id === id;
    })
  }
  getUserList(room){
    let users = this.users.filter((user) => {
      return user.room === room;
    })
    let namesArray = users.map((user) => {
      return {name: user.name, color: user.color};
    });
    return namesArray;
  }
  getTaskList(room){
    return this.tasks.filter((task) => {
      return task.room === room;
    });
  }
  getTask(id){

  }
  addTask(object){
    this.tasks.push(object);
    return object;
  }
}

module.exports = {Users};
