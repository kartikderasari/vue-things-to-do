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
                    <v-text-field label="Title"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      name="notes"
                      label="Notes"
                      value=""
                      row-height="10"
                      auto-grow
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="['To Do', 'Ongoing', 'Done']"
                      label="Status"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="addTaskDialog = false">
                Close
              </v-btn>
              <v-btn color="blue darken-1" text @click="addTaskDialog = false">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col cols="4">
        <taskCard />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { firestore, auth } from "../config/firebase";
import taskCard from "../components/taskCard";

export default {
  components: { taskCard },
  data: () => {
    return {
      addTaskDialog: false,
    };
  },
  methods: {
    addTask: () => {
      let user = auth().currentUser;

      // if (task == "" || taskStatus == "default") {
      //   alert("Enter some text to add a task!");
      // } else {
      //   let newTaskObj = {
      //     name: task,
      //     status: taskStatus,
      //     notes: taskNotes,
      //     timeStamp: Date.now(),
      //   };
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
