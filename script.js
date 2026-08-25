// Initialize Supabase Client
const SUPABASE_URL = 'https://imwzmsunzgbxipjdjxji.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltd3ptc3VuemdieGlwamRqeGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NDQ4NzcsImV4cCI6MjEwMzIyMDg3N30.zFzuIi161XFqxJw35wCWGClpYFznmrUeWzAw2C8kniE';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Set default date to today
document.getElementById('test-date').valueAsDate = new Date();

const answerKey = {
    q1: "B", q2: "A", q3: "B", q4: "B", q5: "A", q6: "B", q7: "B", q8: "C", q9: "B",
    q10: "A", q11: "A", q12: "A", q13: "B", q14: "A", q15: "A", q16: "B", q17: "C", q18: "C", q19: "A",
    q20: "A", q21: "A", q22: "A", q23: "A", q24: "A", q25: "A", q26: "A",
    q27: "A", q28: "A", q29: "A", q30: "A", q31: "A", q32: "A", q33: "A", q34: "A", q35: "A",
    q36: "A", q37: "A", q38: "A", q39: "A", q40: "A", q41: "A", q42: "A", q43: "A", q44: "A",
    q45: "A", q46: "A", q47: "A", q48: "A", q49: "A", q50: "A", q51: "A", q52: "A", q53: "A",
    q54: "A", q55: "A", q56: "A", q57: "A", q58: "A", q59: "A", q60: "A"
};

async function submitQuiz() {
    const studentName = document.getElementById('student-name').value.trim();
    if (!studentName) {
        alert('Please enter your Name in the log-in section at the bottom before submitting.');
        document.getElementById('student-name').focus();
        return;
    }

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    let score = 0;
    const total = 60;
    const form = document.getElementById('quiz-form');
    const userAnswers = {};

    for (let i = 1; i <= total; i++) {
        const qKey = 'q' + i;
        const qBlock = document.getElementById(qKey);
        const selectedOption = form.querySelector(`input[name="${qKey}"]:checked`);
        
        qBlock.classList.remove('correct', 'incorrect');

        if (selectedOption) {
            userAnswers[qKey] = selectedOption.value;
            if (selectedOption.value === answerKey[qKey]) {
                score++;
                qBlock.classList.add('correct');
            } else {
                qBlock.classList.add('incorrect');
            }
        } else {
            userAnswers[qKey] = null;
            qBlock.classList.add('incorrect');
        }
    }

    const percentage = parseFloat(((score / total) * 100).toFixed(1));
    const remarks = percentage >= 75 ? 'PASSED' : 'NEEDS IMPROVEMENT';

    // Update UI
    document.getElementById('score-val').textContent = `${score} / ${total}`;
    document.getElementById('grade-val').textContent = `${percentage}%`;
    const remarksElem = document.getElementById('remarks-val');
    remarksElem.textContent = remarks;
    remarksElem.style.color = percentage >= 75 ? 'var(--success)' : 'var(--danger)';

    // Save submission to Supabase
    try {
        const { error } = await supabase.from('test_submissions').insert([
            {
                full_name: studentName,
                student_id: document.getElementById('student-id').value.trim(),
                section: document.getElementById('student-section').value.trim(),
                score: score,
                percentage: percentage,
                remarks: remarks,
                answers: userAnswers
            }
        ]);

        if (error) throw error;
        alert('Test submitted and recorded successfully!');
    } catch (err) {
        console.error('Submission Error:', err);
        alert('Failed to save submission to the database. Check connection settings.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Test & Save';
        document.querySelector('.student-info-block').scrollIntoView({ behavior: 'smooth' });
    }
}
