
const noteSchema = new mongoose.Schema({
    videoUrl: String,
    timestamp: String,
    note: String,
  });
  
  const Note = mongoose.model('Note', noteSchema);
  