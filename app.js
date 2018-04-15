'use strict';

const express = require('express');
//const crypto = require('crypto');
const Datastore = require('@google-cloud/datastore');

// Your Google Cloud Platform project ID
const projectId = 'minibits-200710';

const app = express();
app.enable('trust proxy');

// Create a datastore client
const datastore = new Datastore({
  projectId: projectId,
  keyFilename: 'Minutiae-bd19626dcbe7.json',
});

//const kind = 'Note';

function listNotes() {
  const query = datastore
    .createQuery('Note')
    .order('Value', { descending: true });

  console.debug(query);
  return datastore
    .runQuery(query)
    .then(results => {
      console.debug(results);
      const notes = results[0];
      return notes.map(note => `Addr: ${note.Addr}, Value: ${note.Value}`);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

app.get('/', (req, res, next) => {
  listNotes()
  .then(notes => {
    res
      .status(200)
      .set('Content-Type', 'text/plain')
      .send(`Notes:\n${notes.join('\n')}`)
      .end()
  })
  .catch(next);
});

// [START listen]
const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END listen]

//require(`yargs`) // eslint-disable-line
//  .demand(1)
//  //.command(
//  //  `new <description>`,
//  //  `Adds a task with a description <description>.`,
//  //  {},
//  //  opts => addTask(opts.description)
//  //)
//  //.command(`done <taskId>`, `Marks the specified task as done.`, {}, opts =>
//  //  markDone(opts.taskId)
//  //)
//  .command(`list`, `Lists all notes ordered by creation time.`, {}, listNotes)
//  //.command(`delete <taskId>`, `Deletes a task.`, {}, opts =>
//  //  deleteTask(opts.taskId)
//  //)
//  //.example(`node $0 new "Buy milk"`, `Adds a task with description "Buy milk".`)
//  //.example(`node $0 done 12345`, `Marks task 12345 as Done.`)
//  //.example(`node $0 list`, `Lists all tasks ordered by creation time`)
//  //.example(`node $0 delete 12345`, `Deletes task 12345.`)
//  .wrap(120)
//  .epilogue(`For more information, see https://cloud.google.com/datastore/docs`)
//  .help()
//  .strict().argv;
