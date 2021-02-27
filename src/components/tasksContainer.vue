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
    <v-row v-if="loadingData && tasks.length >= 3" class="mt-5">
      <v-col cols="12" lg="4" md="4" sm="6" v-for="x in 3" :key="x">
        <v-card outlined elevation="0">
          <v-skeleton-loader v-bind="attrs" type="article"></v-skeleton-loader
        ></v-card>
      </v-col>
    </v-row>
    <v-row v-else-if="loadingData && tasks.length < 3" class="mt-5">
      <v-col cols="12" lg="4" md="4" sm="6" v-for="x in tasks.length" :key="x">
        <v-card outlined elevation="0">
          <v-skeleton-loader v-bind="attrs" type="article"></v-skeleton-loader
        ></v-card>
      </v-col>
    </v-row>
    <v-row v-else class="mt-5">
      <v-col class="text-center" v-if="tasks.length == 0" cols="12">
        <p class="subtitle-1">No tasks found!</p>
      </v-col>
      <v-col
        cols="12"
        lg="4"
        md="4"
        sm="6"
        v-for="(task, index) in tasks"
        :key="index"
      >
        <taskCard
          :taskData="{ index, ...task }"
          @readDataCall="readTasks"
          @showNotification="showSnackbar"
          :key="task.timeStamp"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-snackbar v-model="snackbar" timeout="2000">
          {{ notificationText }}
          <template v-slot:action="{ attrs }">
            <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
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
      attrs: {
        class: "mb-6 border",
        boilerplate: true,
        elevation: 0,
      },
      loadingData: false,
      snackbar: false,
      notificationText: "",
    };
  },
  methods: {
    addNewTask: async function() {
      this.addTaskDialog = false;

      if (this.newTask.title == "") {
        this.showSnackbar("Please add a title to the task!");
      } else if (this.newTask.status == "") {
        this.showSnackbar("Please select the status of the task!");
      } else {
        this.newTask.timeStamp = Date.now();
        await FDK.firestore()
          .collection("edata")
          .doc(this.user.uid)
          .collection("todoData")
          .add(this.newTask);
        this.readTasks();
        this.showSnackbar("Task has been added");
      }
      this.clearForm();
    },
    readTasks: async function() {
      this.loadingData = true;
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
      this.loadingData = false;
    },
    showSnackbar: function(value) {
      this.notificationText = value;
      this.snackbar = true;
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
          window.location.href = "./";
        }
      });
    },
  },
  mounted: function() {
    this.checkState();
  },
};
</script>
