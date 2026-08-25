// Initialize Supabase Client
const SUPABASE_URL = 'https://imwzmsunzgbxipjdjxji.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltd3ptc3VuemdieGlwamRqeGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NDQ4NzcsImV4cCI6MjEwMzIyMDg3N30.zFzuIi161XFqxJw35wCWGClpYFznmrUeWzAw2C8kniE';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Define correct answers key (Update with your question radio names and correct choices)
const ANSWER_KEY = {
  q1: 'A',
  q2: 'B',
  // Add all 60 question keys here (e.g., q3: 'C', q4: 'D', ...)
};

document.getElementById('submit-btn').addEventListener('click', async () => {
  const submitBtn = document.getElementById('submit-btn');

  // 1. Gather Input Values
  const fullName = document.getElementById('full_name').value.trim();
  const studentLrn = document.getElementById('student_lrn').value.trim();
  const gradeSection = document.getElementById('grade_section').value.trim();
  const dateVal = document.getElementById('submission_date').value || new Date().toISOString().split('T')[0];

  // Validate Student Info
  if (!fullName || !studentLrn || !gradeSection) {
    alert('Please complete all student login details before submitting.');
    return;
  }

  // 2. Calculate Quiz Score
  let score = 0;
  const totalQuestions = Object.keys(ANSWER_KEY).length || 60;

  for (const [qName, correctAnswer] of Object.entries(ANSWER_KEY)) {
    const selected = document.querySelector(`input[name="${qName}"]:checked`);
    if (selected && selected.value === correctAnswer) {
      score++;
    }
  }

  const percentage = parseFloat(((score / totalQuestions) * 100).toFixed(2));
  const remarks = percentage >= 75 ? 'PASSED' : 'FAILED';

  // 3. Update UI UI Summary
  document.getElementById('score-text').textContent = `${score} / ${totalQuestions}`;
  document.getElementById('percentage-text').textContent = `${percentage}%`;
  document.getElementById('remarks-text').textContent = remarks;

  // 4. Send Data to Supabase
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  const { data, error } = await supabaseClient
    .from('student_results')
    .insert([
      {
        full_name: fullName,
        student_lrn: studentLrn,
        grade_section: gradeSection,
        submission_date: dateVal,
        total_score: score,
        percentage_grade: percentage,
        remarks: remarks
      }
    ]);

  if (error) {
    console.error('Supabase Error:', error);
    alert('Failed to save submission: ' + error.message);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Test & Save';
  } else {
    alert('Test submitted and saved successfully!');
    submitBtn.textContent = 'Submitted';
  }
});
