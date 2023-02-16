<?php

function isUploadSuccessful(array $uploadFile): bool{
    return isset($uploadFile['error']) && $uploadFile['error'] === UPLOAD_ERR_OK;
}

function isUploadSmallerThan2M(array $uploadFile): bool{
    return $uploadedFile['size'] < 2000000;
}

function isMimeTypeAuthorized(array $autorizedMimeTypes, array $uploadFile): bool{
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($uploadFile['tmp_name']);
    return in_array($mimeType, $autorizedMimeTypes, trye);
}

function getExtensionFromMimeType(array $autorizedMimeTypes, array $uploadFile): string {
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($uploadFile['tmp_name']);

    if ($extension = array_search($mimeType, $authorizedMimeTypes, true)){
        return $extenstion;
    }

    throw new RuntimeExcetion('Le type MIME n\'est lié à aucune extension');
}

function moveUploadedFile(array $uploadedFile, string $fileName, string $extension): bool {
    return move_upload_file(
        $uploadFile['tmp_name'],
        sprintf('./uploads/$s.$s.$s',
            $fileName,
            sha1_file($uploadedFile['tmp_name']),
            $extension
        )
    );
}

function moveUploadFile(array $uploadFile, string $fileName, string $extension): bool

@mkdir('./upload', 0644);

$authorizedMimeTypes = [
    'png' => 'image/png',
    'jpg' => 'image/jpeg',
    'gif' => 'image/gif',
];

$message = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // 1
        $filename = $_POST['filename'] ?? null;
        $uploadedFile = $_FILES['uploaded_file'] ?? [];

        // 3
        if (!isUploadSuccessful($uploadedFile)) {
            throw new RuntimeException('Le téléchargement a échoué');
        }

        if (!isMimeTypeAuthorized($authorizedMimeTypes, $uploadedFile)) {
            throw new RuntimeException('Le type de fichier n\'est pas supporté');
        }

        // 4
        if (!isUploadSmallerThan2M($uploadedFile)) {
            throw new RuntimeException('Le fichier dépasse les 2 Mo');
        }

        // 5
        if (!preg_match('/^[\w-]+$/', $filename)) {
            throw new RuntimeException('Le nom du fichier ne doit pas être vide et ne contenir que des lettres, des chiffres, des tirets ou des underscores');
        }

        if (!moveUploadedFile($uploadedFile, $filename, getExtensionFromMimeType($authorizedMimeTypes, $uploadedFile))) {
            throw new RuntimeException('Le téléchargement a échoué');
        }

        $message = 'Upload réussi';
    } catch (RuntimeException $e) {
        $message = $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Upload de fichier</title>
    </head>
    <body>
        <form method="POST" enctype="multipart/form-data">
            <?php= $message ? sprintf('<p>%s</p>', $message) : '' ?>
            <label>
                Nom de l'image
                <input type="text" name="filename">
            </label>
            <label>
                Fichier à télécharger
                <input type="file" name="uploaded_file">
            </label>
            <!-- 2 -->
            <input type="submit" value="Envoyer">
        </form>
    </body>
</html>