// 1. Initialize Supabase Client (Replace with your keys from Supabase Dashboard)
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Set today's date automatically in the input box
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('submission_date').valueAsDate = new Date();
});

// 2. Define Answer Key (Map question names to correct option letters)
const ANSWER_KEY = {
  q1: 'A',
  q2: 'B',
  q3: 'C',
  q4: 'D',
  // Add all your remaining question keys here (e.g., q5: 'A', ...)
};

// 3. Handle Submit Button Click
document.getElementById('submit-btn').addEventListener('click', async () => {
  const submitBtn = document.getElementById('submit-btn');

  // Gather Input Values
  const fullName = document.getElementById('full_name').value.trim();
  const studentLrn = document.getElementById('student_lrn').value.trim();
  const gradeSection = document.getElementById('grade_section').value.trim();
  const submissionDate = document.getElementById('submission_date').value;

  // Validate Required Fields
  if (!fullName || !studentLrn || !gradeSection) {
    alert('Please fill in your Full Name, Student ID/LRN, and Grade & Section before submitting.');
    return;
  }

  // Calculate Score
  let score = 0;
  const totalQuestions = 60;

  for (const [qName, correctAnswer] of Object.entries(ANSWER_KEY)) {
    const selectedOption = document.querySelector(`input[name="${qName}"]:checked`);
    if (selectedOption && selectedOption.value === correctAnswer) {
      score++;
    }
  }

  const percentage = parseFloat(((score / totalQuestions) * 100).toFixed(2));
  const remarks = percentage >= 75 ? 'PASSED' : 'FAILED';

  // Update Summary UI Display
  document.getElementById('score-text').textContent = `${score} / ${totalQuestions}`;
  document.getElementById('percentage-text').textContent = `${percentage}%`;
  document.getElementById('remarks-text').textContent = remarks;

  // Submit to Supabase Database
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  try {
    const { data, error } = await supabaseClient
      .from('student_results')
      .insert([
        {
          full_name: fullName,
          student_lrn: studentLrn,
          grade_section: gradeSection,
          submission_date: submissionDate,
          total_score: score,
          percentage_grade: percentage,
          remarks: remarks
        }
      ]);

    if (error) throw error;

    alert('Test submitted and saved successfully!');
    submitBtn.textContent = 'Submitted';

  } catch (err) {
    console.error('Supabase Error:', err);
    alert('Failed to save test: ' + (err.message || 'Unknown error'));
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Test & Save';
  }
});
