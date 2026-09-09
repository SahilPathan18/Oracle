<?php
header('Content-Type: application/json');
$teams = [
    ["name" => "Neon Phantoms", "score" => rand(800, 1000), "status" => "SURVIVING"],
    ["name" => "Cyber Reapers", "score" => rand(600, 950), "status" => "SURVIVING"],
    ["name" => "Syntax Error", "score" => rand(200, 500), "status" => "CRITICAL"],
    ["name" => "Zero Day", "score" => rand(900, 1200), "status" => "SURVIVING"],
    ["name" => "Null Pointers", "score" => 0, "status" => "ELIMINATED"]
];
echo json_encode($teams);
?>