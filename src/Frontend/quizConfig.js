export const QUIZ_QUESTIONS = [
  {
    id: 'business',
    label: 'I enjoy business strategy, money management, and economic decision-making.',
    shortLabel: 'Business and Finance',
    weight: 1.2,
    keywords: ['business', 'accounting', 'finance', 'economics', 'marketing', 'management', 'supply chain', 'entrepreneurship']
  },
  {
    id: 'technology',
    label: 'I want to build software, solve technical problems, or work with data and systems.',
    shortLabel: 'Technology and Data',
    weight: 1.35,
    keywords: ['computer science', 'information systems', 'data science', 'software', 'game development', 'engineering', 'statistics']
  },
  {
    id: 'creative',
    label: 'I am energized by creativity, media, storytelling, design, music, or performance.',
    shortLabel: 'Creative and Media',
    weight: 1.05,
    keywords: ['art', 'design', 'theatre', 'music', 'journalism', 'communications', 'photography', 'multimedia', 'visual']
  },
  {
    id: 'people',
    label: 'I want a career focused on helping, teaching, mentoring, or serving communities.',
    shortLabel: 'Helping Others',
    weight: 1.1,
    keywords: ['education', 'teaching', 'leadership', 'community', 'human services', 'nonprofit', 'organizational communication', 'adolescent']
  },
  {
    id: 'science',
    label: 'I enjoy science, labs, understanding living systems, and evidence-based research.',
    shortLabel: 'Science and Research',
    weight: 1.25,
    keywords: ['biology', 'biological', 'chemistry', 'physics', 'mathematics', 'environmental', 'earth', 'research']
  },
  {
    id: 'outdoor',
    label: 'I prefer hands-on work connected to nature, agriculture, or environmental systems.',
    shortLabel: 'Agriculture and Environment',
    weight: 1,
    keywords: ['agriculture', 'environmental', 'earth', 'natural', 'animal', 'soil', 'sustainability']
  },
  {
    id: 'society',
    label: 'I am interested in society, policy, law, government, and how communities function.',
    shortLabel: 'Policy and Society',
    weight: 1,
    keywords: ['political science', 'sociology', 'government', 'policy', 'justice', 'history', 'public', 'social']
  },
  {
    id: 'language',
    label: 'I enjoy writing, communication, language learning, and critical thinking.',
    shortLabel: 'Language and Communication',
    weight: 0.95,
    keywords: ['english', 'philosophy', 'languages', 'communication', 'journalism', 'writing', 'global languages']
  }
];

const QUIZ_TOTAL_WEIGHT = QUIZ_QUESTIONS.reduce((total, question) => total + question.weight, 0);

export function getDefaultQuizAnswers() {
  return QUIZ_QUESTIONS.reduce((answers, question) => ({
    ...answers,
    [question.id]: 3
  }), {});
}

export function getRankedQuizMatches(majors, quizAnswers) {
  return majors
    .map((major) => {
      const combinedText = `${major.major} ${major.Department} ${major.collegeOfMajor}`.toLowerCase();
      let matchedWeight = 0;
      let weightedPreference = 0;
      let matchedTraitCount = 0;
      const reasons = [];
      // matchedTraits powers the "why this matched you" breakdown on each result card
      const matchedTraits = [];

      QUIZ_QUESTIONS.forEach((question) => {
        const hasKeywordMatch = question.keywords.some((keyword) => combinedText.includes(keyword));
        // if none of this question's keywords appear in the major text, skip it entirely
        if (!hasKeywordMatch) {
          return;
        }

        const answer = quizAnswers[question.id] ?? 3;
        matchedWeight += question.weight;
        weightedPreference += ((answer - 1) / 4) * question.weight;
        matchedTraitCount += 1;

        // bucket the raw score into a label so the UI can color-code it
        const strength = answer >= 4 ? 'strong' : answer >= 3 ? 'neutral' : 'weak';
        matchedTraits.push({ label: question.shortLabel, score: answer, strength });

        // only include in reasons if the user actually rated it highly (4 or 5)
        if (answer >= 4) {
          reasons.push(question.shortLabel);
        }
      });

      const compatibility = matchedWeight > 0 ? (weightedPreference / matchedWeight) * 100 : 0;
      const coverage = (matchedWeight / QUIZ_TOTAL_WEIGHT) * 100;
      const rankScore = compatibility * 0.75 + coverage * 0.25;

      return {
        ...major,
        compatibility,
        coverage,
        rankScore,
        matchedTraitCount,
        // dedupe reasons in case two questions share a shortLabel, cap at 2 for display
        reasons: [...new Set(reasons)].slice(0, 2),
        matchedTraits
      };
    })
    .sort((a, b) => b.rankScore - a.rankScore)
    .slice(0, 12);
}
