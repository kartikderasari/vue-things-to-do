<template>
  <v-container>
    <v-row class="mt-5">
      <v-col class="d-flex align-center">
        <span class="headline">Tasks</span>
        <v-spacer></v-spacer>
        <v-dialog v-model="addTaskDialog" max-width="600px" scrollable>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-2"
              fab
              dark
              color="indigo"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon dark>
                mdi-plus
              </v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Add a Task</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Title"
                      v-model="newTask.title"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      name="notes"
                      label="Notes"
                      value=""
                      row-height="10"
                      auto-grow
                      v-model="newTask.notes"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="['To Do', 'Ongoing', 'Done']"
                      label="Status"
                      required
                      v-model="newTask.status"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="
                  {
                    addTaskDialog = false;
                    clearForm();
                  }
                "
              >
                Close
              </v-btn>
              <v-btn color="blue darken-1" text @click="addNewTask()">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col cols="4" v-for="(task, index) in tasks" :key="index">
        <taskCard :taskData="{ index, ...task }" @readDataCall="readTasks()" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FDK from "../config/firebase";
import taskCard from "../components/taskCard";

export default {
  components: { taskCard },
  data: () => {
    return {
      addTaskDialog: false,
      newTask: {
        title: "",
        notes: "",
        status: "",
        timeStamp: "",
      },
      tasks: [],
      user: "",
    };
  },
  methods: {
    addNewTask: async function() {
      this.addTaskDialog = false;

      if (this.newTask.title == "" || this.newTask.status == "") {
        alert("Enter some text to add a task!");
      } else {
        this.newTask.timeStamp = Date.now();
      }
      await FDK.firestore()
        .collection("edata")
        .doc(this.user.uid)
        .collection("todoData")
        .add(this.newTask);
      this.clearForm();
      this.readTasks();
    },
    readTasks: async function() {
      await FDK.firestore()
        .collection("edata")
        .doc(this.user.uid)
        .collection("todoData")
        .orderBy("timeStamp", "desc")
        .get()
        .then((docs) => {
          this.tasks = [];
          docs.forEach((doc) => {
            let temp = doc.data();
            temp.id = doc.id;
            this.tasks.push(temp);
          });
        })
        .catch((err) => console.log(err));
      console.log(this.tasks);
    },
    clearForm: function() {
      this.newTask = {
        title: "",
        notes: "",
        status: "",
        timeStamp: "",
      };
    },
    checkState: function() {
      let ref = this;
      FDK.auth().onAuthStateChanged(function(user) {
        if (user) {
          ref.user = user;
          ref.readTasks();
        } else {
          window.location.href = "./login";
        }
      });
    },
  },
  mounted: function() {
    this.checkState();
  },
};
</script>