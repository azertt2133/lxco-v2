rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Dossiers : chaque utilisateur ne voit que les siens
    match /folders/{folderId} {
      allow read, write: if request.resource.data.userId == request.auth.uid
                         || resource.data.userId == request.auth.uid;
    }

    // Tâches : idem
    match /tasks/{taskId} {
      allow read, write: if request.resource.data.userId == request.auth.uid
                         || resource.data.userId == request.auth.uid;
    }
  }
}
