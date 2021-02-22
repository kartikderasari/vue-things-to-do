<template>
  <v-card outlined>
    <v-card-title
      >Title
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
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae ve
      </p>
      <small>Last updated: 1/6/2021, 7:00:11 PM</small>
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-card-actions class="justify-center">
      <v-btn outlined small>
        To Do
      </v-btn>
      <v-btn outlined small color="primary">
        Ongoing
      </v-btn>
      <v-btn outlined small color="success">
        Done
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { firestore, auth } from "../config/firebase";

export default {
  data: () => {
    return {
      editTaskDialog: false,
    };
  },
  methods: {
    updateStatus: (task, id, taskNotes, status) => {
      let user = auth().currentUser;
      let updatedTask = {
        name: task,
        status: status,
        notes: taskNotes,
        timeStamp: Date.now(),
      };
      firestore()
        .collection("edata")
        .doc(user.uid)
        .collection("todoData")
        .doc(id)
        .update(updatedTask)
        .then(() => console.log(user))
        .catch((e) => console.log(e));
    },
  },
};
</script>
