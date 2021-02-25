<template>
  <v-lazy>
    <v-card outlined>
      <v-card-title>
        {{ this.taskData.title }}
        <v-spacer></v-spacer>

        <v-dialog v-model="infoDialog" max-width="500" scrollable>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon @click="infoDialog = true" v-bind="attrs" v-on="on">
              <v-icon>
                mdi-information-outline
              </v-icon>
            </v-btn>
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
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon>
              <v-icon>
                mdi-circle-edit-outline
              </v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Edit a Task</span>
            </v-card-title>
            <v-card-text>
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
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="editTaskDialog = false">
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
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon @click="deleteDialog = true" v-bind="attrs" v-on="on">
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="headline">
              Delete task?
            </v-card-title>
            <v-card-text>Are you sure you want to delete the task?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="deleteDialog = false">
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
        <p v-if="taskData.notes.length <= 200">
          {{ this.taskData.notes }}
        </p>
        <p v-else>
          <!-- let updateSummary = (text, length) => { if (text.length >= length) {
          let x = text.substring(0, length) + '...'; return x; } else { return
          text; } } -->

          {{ taskData.notes.substring(0, 200) }}...
        </p>
        <small
          >Last updated:
          {{ new Date(this.taskData.timeStamp).toLocaleString() }}
        </small>
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
        });
      this.resetButtons();
      this.setButtonDisabled();
    },
    updateTask: function() {
      this.editTaskData.timeStamp = Date.now();
      let user = FDK.auth().currentUser;
      FDK.firestore()
        .collection("edata")
        .doc(user.uid)
        .collection("todoData")
        .doc(this.taskData.id)
        .set(this.editTaskData)
        .then(() => {
          this.$emit("readDataCall");
        });
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
};
</script>
