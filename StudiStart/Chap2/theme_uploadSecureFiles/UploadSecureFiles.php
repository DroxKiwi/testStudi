<?php

# 1
function isUploadSuccessful(array $uploadedFile): bool {
    return isset($uploadedFile['error']) && $uploadedFile['error'] === UPLOAD_ERR_OK;
}

# 2
function isUploadSmallerThan1M(array $uploadedFile): bool {
    return $uploadedFile['size'] < 1000000;
}

# 3
function isMimeTypeAuthorized(array $uploadedFile): bool {
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($uploadedFile['tmp_name']);

    return $mimeType === 'image/png';
}

# 4
function getExtensionFromMimeType(string $mimeType): ?string {
    switch ($mimeType) {
        case 'image/png':
            return 'png';
        default:
            throw new RuntimeException('Unsupported mime type');
    }
}

function moveUploadedFile(array $uploadedFile): bool {
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($uploadedFile['tmp_name']);

    return move_uploaded_file(
        $uploadedFile['tmp_name'],
        sprintf('./uploads/%s.%s',
            sha1_file($uploadedFile['tmp_name']),
            getExtensionFromMimeType($mimeType)
        )
    );
}

# 1
if (!isUploadSuccessful($_FILES['uploaded_file'])) {
    throw new RuntimeException('Error while uploading file.');
}

# 2
if (!isUploadSmallerThan1M($_FILES['uploaded_file'])) {
    throw new RuntimeException('File is too big.');
}

# 3
if (!isMimeTypeAuthorized($_FILES['uploaded_file'])) {
    throw new RuntimeException('Invalid file mime type.');
}

# 4
if (!moveUploadedFile($_FILES['uploaded_file'])) {
    throw new RuntimeException('Impossible to upload file.');
}

echo 'Upload OK';