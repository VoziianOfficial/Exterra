<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

$responseSuccess = [
    'success' => true,
    'message' => 'Thank you. Your request has been received.'
];

$responseError = [
    'success' => false,
    'message' => 'Please check the required fields and try again.'
];



if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode($responseError);
    exit;
}

function clean_input(?string $value): string
{
    $value = trim((string) $value);
    $value = str_replace(["\r", "\n"], ' ', $value);
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

function clean_multiline(?string $value): string
{
    $value = trim((string) $value);
    $value = preg_replace("/\r\n|\r/", "\n", $value);
    $value = preg_replace("/[ \t]+/", ' ', $value);
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

function fail(array $responseError): void
{
    http_response_code(400);
    echo json_encode($responseError);
    exit;
}

$honeypot = trim((string) ($_POST['website'] ?? ''));

if ($honeypot !== '') {
    fail($responseError);
}

$fullName = clean_input($_POST['fullName'] ?? '');
$emailRaw = trim((string) ($_POST['email'] ?? ''));
$email = filter_var($emailRaw, FILTER_SANITIZE_EMAIL);
$phone = clean_input($_POST['phone'] ?? '');
$service = clean_input($_POST['service'] ?? '');
$message = clean_multiline($_POST['message'] ?? '');
$sourcePage = clean_input($_POST['sourcePage'] ?? 'unknown');
$privacyConsent = clean_input($_POST['privacyConsent'] ?? '');
$formStartedAt = trim((string) ($_POST['formStartedAt'] ?? ''));

$allowedServices = [
    'Siding Installation',
    'Siding Replacement',
    'Siding Repair',
    'Vinyl Siding',
    'Fiber Cement Siding',
    'Wood & Composite Siding'
];

if ($fullName === '' || mb_strlen($fullName) < 2 || mb_strlen($fullName) > 120) {
    fail($responseError);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 180) {
    fail($responseError);
}

if ($phone === '' || mb_strlen($phone) < 6 || mb_strlen($phone) > 40) {
    fail($responseError);
}

if ($service === '' || !in_array(htmlspecialchars_decode($service, ENT_QUOTES), $allowedServices, true)) {
    fail($responseError);
}

if ($message === '' || mb_strlen(strip_tags(htmlspecialchars_decode($message, ENT_QUOTES))) < 12 || mb_strlen($message) > 3000) {
    fail($responseError);
}

if ($privacyConsent !== 'yes') {
    fail($responseError);
}



if ($formStartedAt !== '' && ctype_digit($formStartedAt)) {
    $startedSeconds = ((int) $formStartedAt) / 1000;
    $nowSeconds = time();

    if (($nowSeconds - $startedSeconds) < 3) {
        fail($responseError);
    }
}



$recipientEmail = 'support@exterra.example';
$recipientName = 'Exterra Request Desk';

$subject = 'New Exterra siding request';

$decodedMessage = htmlspecialchars_decode($message, ENT_QUOTES);
$decodedFullName = htmlspecialchars_decode($fullName, ENT_QUOTES);
$decodedPhone = htmlspecialchars_decode($phone, ENT_QUOTES);
$decodedService = htmlspecialchars_decode($service, ENT_QUOTES);
$decodedSourcePage = htmlspecialchars_decode($sourcePage, ENT_QUOTES);

$emailBody = implode("\n", [
    'New siding request received through Exterra.',
    '',
    'IMPORTANT PLATFORM NOTE:',
    'Exterra is an independent siding provider-matching platform. Exterra does not perform siding work directly. Final pricing, scheduling, warranties, licensing, insurance, availability, and service terms are provided by participating providers.',
    '',
    'Request details:',
    'Full name: ' . $decodedFullName,
    'Email: ' . $email,
    'Phone: ' . $decodedPhone,
    'Service category: ' . $decodedService,
    'Source page: ' . $decodedSourcePage,
    '',
    'Message:',
    $decodedMessage,
    '',
    'Privacy consent: confirmed',
    '',
    'Submitted at: ' . gmdate('Y-m-d H:i:s') . ' UTC',
    'IP address: ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'),
    'User agent: ' . ($_SERVER['HTTP_USER_AGENT'] ?? 'unknown')
]);

$headers = [];

$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'From: Exterra Website <no-reply@' . ($_SERVER['SERVER_NAME'] ?? 'localhost') . '>';
$headers[] = 'Reply-To: ' . $decodedFullName . ' <' . $email . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();

$headersString = implode("\r\n", $headers);

$mailSent = @mail($recipientEmail, $subject, $emailBody, $headersString);

if (!$mailSent) {
    

    $logDir = __DIR__ . '/form-submissions';

    if (!is_dir($logDir)) {
        @mkdir($logDir, 0755, true);
    }

    $logFile = $logDir . '/contact-requests.log';
    $logSaved = @file_put_contents(
        $logFile,
        "==============================\n" . $emailBody . "\n\n",
        FILE_APPEND | LOCK_EX
    );

    if ($logSaved === false) {
        http_response_code(500);
        echo json_encode($responseError);
        exit;
    }
}

http_response_code(200);
echo json_encode($responseSuccess);
exit;
