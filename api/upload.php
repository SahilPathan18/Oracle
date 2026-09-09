<?php
$message = "";
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['audio_file'])) {
    $target_dir = "../assets/uploads/";
    if (!is_dir($target_dir)) { mkdir($target_dir, 0777, true); }
    $target_file = $target_dir . basename($_FILES["audio_file"]["name"]);
    $fileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
    
    if($fileType == "mp3" || $fileType == "wav" || $fileType == "ogg") {
        if (move_uploaded_file($_FILES["audio_file"]["tmp_name"], $target_file)) {
            $message = "<div class='alert alert-success'>Audio track uploaded to mainframe successfully.</div>";
        } else {
            $message = "<div class='alert alert-danger'>Upload failed. Network interference detected.</div>";
        }
    } else {
        $message = "<div class='alert alert-warning'>Invalid format. Only MP3, WAV, or OGG allowed.</div>";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Upload Audio | ORACLE</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">
</head>
<body style="padding-top: 80px;">
    <nav class="navbar navbar-expand-lg fixed-top"><div class="container-fluid"><a class="navbar-brand text-danger fw-bold" href="../index.html">ORACLE</a></div></nav>
    <div class="container mt-5" style="max-width: 600px;">
        <div class="card card-custom p-4">
            <h3 class="text-center text-info mb-4">Upload Battle Anthem</h3>
            <?php echo $message; ?>
            <form action="upload.php" method="POST" enctype="multipart/form-data">
                <div class="mb-3"><label class="form-label">Select Audio File (.mp3, .wav)</label><input type="file" name="audio_file" class="form-control bg-dark text-white border-info" required></div>
                <button type="submit" class="btn btn-info w-100">Upload to Database</button>
            </form>
        </div>
    </div>
</body>
</html>