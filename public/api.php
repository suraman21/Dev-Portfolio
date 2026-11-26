<?php
declare(strict_types=1);

/**
 * Thin bridge inside /public that invokes the PHP + MySQL backend stored
 * securely outside webroot in ../app/index.php (using ../app/config.php).
 */
require_once dirname(__DIR__) . '/app/index.php';
