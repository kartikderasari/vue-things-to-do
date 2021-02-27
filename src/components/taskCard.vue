<template>
  <div>
    <v-lazy>
      <v-card outlined>
        <v-card-title>
          <span v-if="this.taskData.title.length <= 20">
            {{ this.taskData.title }}
          </span>

          <span v-else> {{ this.taskData.title.substring(0, 20) }}... </span>
          <v-spacer></v-spacer>

          <v-dialog v-model="infoDialog" max-width="500" scrollable>
            <template #activator="{ on: dialog, attrs }">
              <v-tooltip bottom>
                <template #activator="{on: tooltip }">
                  <v-btn
                    icon
                    @click="infoDialog = true"
                    v-bind="attrs"
                    v-on="{ ...tooltip, ...dialog }"
                  >
                    <v-icon>
                      mdi-information-outline
                    </v-icon>
                  </v-btn>
                </template>
                <span>View </span>
              </v-tooltip>
            </template>

            <v-card>
              <v-card-title class="headline">
                {{ this.taskData.title }}
              </v-card-title>

              <v-divider></v-divider>

              <v-card-text class="mt-2">
                {{ this.taskData.notes }}
              </v-card-text>

              <v-card-actions class="justify-center">
                <v-btn
                  :outlined="toDoOutline"
                  small
                  :disabled="toDoFlag"
                  @click="
                    {
                      infoDialog = false;
                      updateStatus('To Do');
                    }
                  "
                >
                  To Do
                </v-btn>
                <v-btn
                  :outlined="onGoingOutline"
                  small
                  color="primary"
                  :disabled="onGoingFlag"
                  @click="
                    {
                      infoDialog = false;
                      updateStatus('Ongoing');
                    }
                  "
                >
                  Ongoing
                </v-btn>
                <v-btn
                  :outlined="doneOutline"
                  small
                  color="success"
                  :disabled="doneFlag"
                  @click="
                    {
                      infoDialog = false;
                      updateStatus('Done');
                    }
                  "
                >
                  Done
                </v-btn>
              </v-card-actions>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="infoDialog = false">
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="editTaskDialog" max-width="600px" scrollable>
            <template #activator="{ on: dialog, attrs }">
              <v-tooltip bottom>
                <template #activator="{on: tooltip }">
                  <v-btn
                    icon
                    @click="editTaskDialog = true"
                    v-bind="attrs"
                    v-on="{ ...tooltip, ...dialog }"
                  >
                    <v-icon>
                      mdi-circle-edit-outline
                    </v-icon>
                  </v-btn>
                </template>
                <span>Edit</span>
              </v-tooltip>
            </template>

            <v-card>
              <v-card-title>
                <span class="headline">Edit a Task</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="mt-2">
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Title"
                        v-model="editTaskData.title"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        name="notes"
                        label="Notes"
                        value=""
                        row-height="10"
                        auto-grow
                        v-model="editTaskData.notes"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        :items="['To Do', 'Ongoing', 'Done']"
                        label="Status"
                        required
                        v-model="editTaskData.status"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  color="blue darken-1"
                  text
                  @click="editTaskDialog = false"
                >
                  Close
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="
                    {
                      editTaskDialog = false;
                      updateTask();
                    }
                  "
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="deleteDialog" persistent max-width="290">
            <template #activator="{ on: dialog, attrs }">
              <v-tooltip bottom>
                <template #activator="{on: tooltip }">
                  <v-btn
                    icon
                    @click="deleteDialog = true"
                    v-bind="attrs"
                    v-on="{ ...tooltip, ...dialog }"
                  >
                    <v-icon>
                      mdi-close
                    </v-icon>
                  </v-btn>
                </template>
                <span>Delete</span>
              </v-tooltip>
            </template>

            <v-card>
              <v-card-title class="headline">
                Delete task?
              </v-card-title>
              <v-card-text
                >Are you sure you want to delete the task?</v-card-text
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green darken-1"
                  text
                  @click="deleteDialog = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="red darken-1"
                  text
                  @click="
                    {
                      deleteDialog = false;
                      deleteTask();
                    }
                  "
                >
                  Delete
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-title>

        <v-card-subtitle>
          <p class="body-2" v-if="taskData.notes.length <= 200">
            {{ this.taskData.notes }}
          </p>
          <p class="body-2" v-else>{{ taskData.notes.substring(0, 200) }}...</p>
          <p class="body-2">
            Last updated:
            {{ new Date(this.taskData.timeStamp).toLocaleString() }}
          </p>
        </v-card-subtitle>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn
            :outlined="toDoOutline"
            small
            :disabled="toDoFlag"
            @click="updateStatus('To Do')"
          >
            To Do
          </v-btn>
          <v-btn
            :outlined="onGoingOutline"
            small
            color="primary"
            :disabled="onGoingFlag"
            @click="updateStatus('Ongoing')"
          >
            Ongoing
          </v-btn>
          <v-btn
            :outlined="doneOutline"
            small
            color="success"
            :disabled="doneFlag"
            @click="updateStatus('Done')"
          >
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-lazy>
  </div>
</template>

<script>
import FDK from "../config/firebase";

export default {
  data: () => {
    return {
      editTaskDialog: false,
      toDoFlag: false,
      onGoingFlag: false,
      deleteDialog: false,
      doneFlag: false,
      toDoOutline: true,
      doneOutline: true,
      onGoingOutline: true,
      infoDialog: false,
      editTaskData: {
        title: "",
        notes: "",
        status: "",
        timeStamp: "",
        id: "",
      },
    };
  },
  props: ["taskData"],
  methods: {
    setButtonDisabled: function() {
      this.resetButtons();
      if (this.taskData.status == "To Do") {
        this.toDoFlag = true;
        this.toDoOutline = false;
      } else if (this.taskData.status == "Ongoing") {
        this.onGoingFlag = true;
        this.onGoingOutline = false;
      } else if (this.taskData.status == "Done") {
        this.doneFlag = true;
        this.doneOutline = false;
      }
    },
    updateStatus: function(status) {
      let user = FDK.auth().currentUser;
      let temp = {
        title: this.taskData.title,
        notes: this.taskData.notes,
        status: status,
        timeStamp: Date.now(),
      };
      FDK.firestore()
        .collection("edata")
        .doc(user.uid)
        .collection("todoData")
        .doc(this.taskData.id)
        .set(temp)
        .then(() => {
          this.$emit("readDataCall");
          this.$emit("showNotification", "Status has been updated");
        });
      this.resetButtons();
      this.setButtonDisabled();
    },
    updateTask: function() {
      if (this.editTaskData.title == "") {
        this.$emit("showNotification", "Please add a title to the task!");
      } else if (this.editTaskData.status == "") {
        this.$emit("showNotification", "Please select the status of the task!");
      } else {
        this.editTaskData.timeStamp = Date.now();
        let user = FDK.auth().currentUser;
        FDK.firestore()
          .collection("edata")
          .doc(user.uid)
          .collection("todoData")
          .doc(this.taskData.id)
          .set(this.editTaskData)
          .then(() => {
            this.$emit("showNotification", "Task has been updated");
            this.$emit("readDataCall");
          });
      }
    },
    resetButtons: function() {
      this.toDoFlag = false;
      this.onGoingFlag = false;
      this.doneFlag = false;
      this.toDoOutline = true;
      this.doneOutline = true;
      this.onGoingOutline = true;
    },
    deleteTask: async function() {
      let user = FDK.auth().currentUser;
      await FDK.firestore()
        .collection("edata")
        .doc(user.uid)
        .collection("todoData")
        .doc(this.taskData.id)
        .delete();
      this.$emit("showNotification", "Task has been deleted");
      this.$emit("readDataCall");
    },
    setEditDialogData: function() {
      this.editTaskData.title = this.taskData.title;
      this.editTaskData.notes = this.taskData.notes;
      this.editTaskData.status = this.taskData.status;
    },
  },
  mounted: function() {
    this.resetButtons();
    this.setButtonDisabled();
    this.setEditDialogData();
  },
  watch: {
    editTaskDialog(visible) {
      if (visible) {
        this.setEditDialogData();
      }
    },
  },
};
</script>
