<template>
  <v-container fluid>
    <v-row class="text-center teal  lighten-5" align="center" justify="center">
      <v-col class="my-5" cols="12" md="6" sm="12">
        <h4 class="text-start font-weight-medium">Task Name</h4>
        <v-text-field
          label="Enter Task Name here"
          solo
          flat
          v-model="newTask.newTaskTitle"
        ></v-text-field>
        <h4 class="text-start font-weight-medium">Notes</h4>
        <v-textarea
          solo
          name="input-7-4"
          label="Enter Task Notes here"
          auto-grow
          clearable
          clear-icon="mdi-close-circle"
          rows="1"
          row-height="20"
          flat
          v-model="newTask.newTaskNotes"
        ></v-textarea>
        <h4 class="text-start font-weight-medium">Status</h4>
        <v-select
          :items="items"
          label="Select Task Status"
          solo
          flat
          v-model="newTask.newTaskStatus"
        ></v-select>
        <v-btn color="primary" elevation="1" @click="addTask()">Add Task</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { firestore, auth } from "../config/firebase";

export default {
  name: "addTask",
  data: () => {
    return {
      items: ["To do", "Ongoing", "Done"],
      newTask: {
        newTaskTitle: "",
        newTaskNotes: "",
        newTaskStatus: "",
        newTasktimeStamp: "",
      },
    };
  },
  methods: {
    addTask: () => {
      let user = auth().currentUser;

      if (this.newTask.newTaskTitle == "" || this.newTask.newTaskStatus == "") {
        alert("Enter some text to add a task!");
      } else {
        this.newTask.newTasktimeStamp = Date.now();
      }
      firestore()
        .collection("edata")
        .doc(user.uid)
        .collection("todoData")
        .add()
        .then(() => console.log("user & showdata"));
    },
  },
};
</script>
