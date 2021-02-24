<template>
  <v-card outlined>
    <v-card-title>
      {{ this.taskData.title }}
      <v-spacer></v-spacer>
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
            <v-btn color="blue darken-1" text @click="editTaskDialog = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="editTaskDialog = false">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-btn icon>
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </v-card-title>

    <v-card-subtitle>
      <p>
        {{ this.taskData.notes }}
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
</template>

<script>
import FDK from "../config/firebase";

export default {
  data: () => {
    return {
      editTaskDialog: false,
      toDoFlag: false,
      onGoingFlag: false,
      doneFlag: false,
      toDoOutline: true,
      doneOutline: true,
      onGoingOutline: true,
    };
  },
  props: ["taskData"],
  methods: {
    setButtonDisabled: function() {
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
      console.log(user.uid);
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
    resetButtons: function() {
      this.toDoFlag = false;
      this.onGoingFlag = false;
      this.doneFlag = false;
      this.toDoOutline = true;
      this.doneOutline = true;
      this.onGoingOutline = true;
    },
  },
  mounted: function() {
    this.setButtonDisabled();
  },
  updated: function() {
    this.resetButtons();
    this.setButtonDisabled();
  },
};
</script>
