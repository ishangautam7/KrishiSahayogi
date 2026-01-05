export const calculateFromQuestionnaire = async (req, res) => {
    try {
        const { nitrogen, phosphorus, potassium, ph } = req.body;

        if (!nitrogen || !phosphorus || !potassium || !ph) {
            return res.status(400).json({
                success: false,
                message: 'All question sections are required'
            });
        }

        const N = calculateNitrogen(nitrogen);
        const P = calculatePhosphorus(phosphorus);
        const K = calculatePotassium(potassium);
        const pHValue = calculatepH(ph);

        res.json({
            success: true,
            soil: {
                nitrogen: N,
                phosphorus: P,
                potassium: K,
                ph: pHValue
            },
            interpretation: {
                nitrogen: interpretNitrogen(N),
                phosphorus: interpretPhosphorus(P),
                potassium: interpretPotassium(K),
                ph: interpretpH(pHValue)
            }
        });
    } catch (error) {
        console.error('Questionnaire calculation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate soil metrics',
            error: error.message
        });
    }
};

function calculateNitrogen(answers) {
    const weights = [0.25, 0.20, 0.15, 0.15, 0.15, 0.10];

    let weightedScore = 0;
    for (let i = 0; i < answers.length; i++) {
        weightedScore += ((answers[i] - 1) / 2) * weights[i];
    }
    const consistency = calculateConsistency(answers);
    weightedScore *= consistency;

    // Map to range 4-42
    const N = Math.round(4 + weightedScore * 38);

    // Add realistic variance (±2)
    const variance = Math.round((Math.random() - 0.5) * 4);

    return Math.max(4, Math.min(42, N + variance));
}

function calculatePhosphorus(answers) {
    const weights = [0.25, 0.20, 0.20, 0.15, 0.10, 0.10];

    let weightedScore = 0;
    for (let i = 0; i < answers.length; i++) {
        weightedScore += ((answers[i] - 1) / 2) * weights[i];
    }

    const consistency = calculateConsistency(answers);
    weightedScore *= consistency;

    const P = Math.round(weightedScore * 42);
    const variance = Math.round((Math.random() - 0.5) * 4);

    return Math.max(0, Math.min(42, P + variance));
}

function calculatePotassium(answers) {
    const weights = [0.25, 0.20, 0.15, 0.15, 0.15, 0.10];

    let weightedScore = 0;
    for (let i = 0; i < answers.length; i++) {
        weightedScore += ((answers[i] - 1) / 2) * weights[i];
    }

    const consistency = calculateConsistency(answers);
    weightedScore *= consistency;

    const K = Math.round(weightedScore * 19);
    const variance = Math.round((Math.random() - 0.5) * 2);

    return Math.max(0, Math.min(19, K + variance));
}

/**
 * Calculate pH with weighted scoring
 */
function calculatepH(answers) {
    const weights = [0.20, 0.25, 0.15, 0.15, 0.15, 0.10];

    let weightedScore = 0;
    for (let i = 0; i < answers.length; i++) {
        weightedScore += ((answers[i] - 1) / 2) * weights[i];
    }

    const pH = 5.0 + weightedScore * 3.5;

    return Math.round(pH * 10) / 10;
}

/**
 * Calculate consistency factor
 * Contradictory answers reduce reliability (returns 0.85-1.0)
 */
function calculateConsistency(answers) {
    const mean = answers.reduce((sum, val) => sum + val, 0) / answers.length;
    const variance = answers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / answers.length;

    // Normalize variance (max variance ~0.67 for [1,1,1,3,3,3])
    const normalizedVariance = Math.min(variance / 0.67, 1);

    // High variance = low consistency, return 0.85-1.0
    return 1 - (normalizedVariance * 0.15);
}

/**
 * Interpretation helpers
 */
function interpretNitrogen(N) {
    if (N < 15) return 'Low - Consider nitrogen fertilizer';
    if (N < 30) return 'Medium - Adequate for most crops';
    return 'High - Good nitrogen levels';
}

function interpretPhosphorus(P) {
    if (P < 14) return 'Low - Phosphorus supplementation recommended';
    if (P < 28) return 'Medium - Suitable for general farming';
    return 'High - Excellent phosphorus levels';
}

function interpretPotassium(K) {
    if (K < 7) return 'Low - Add potassium-rich fertilizers';
    if (K < 14) return 'Medium - Balanced potassium levels';
    return 'High - Good potassium reserves';
}

function interpretpH(pH) {
    if (pH < 5.5) return 'Acidic - Consider liming';
    if (pH < 6.5) return 'Slightly Acidic - Good for most crops';
    if (pH < 7.5) return 'Neutral - Ideal pH range';
    return 'Alkaline - May need sulfur amendment';
}
