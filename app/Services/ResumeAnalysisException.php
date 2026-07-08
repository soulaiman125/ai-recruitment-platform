<?php

namespace App\Services;

use RuntimeException;

/**
 * An analysis that could not be produced, carrying a message safe to flash
 * straight to the candidate. The underlying cause rides along as `previous`.
 */
class ResumeAnalysisException extends RuntimeException
{
    //
}
