// src/components/games/MentalArchivesGame/gameUI.ts
import { useLangStore } from '@/i18n/useTranslation';

export const UI_TEXT = {
  // أزرار عامة
  confirmAnswer: { ar: 'تَأْكِيدُ الْإِجَابَة', en: 'Confirm' },
  next: { ar: 'التَّالِي', en: 'Next' },
  back: { ar: 'رُجُوع', en: 'Back' },
  retry: { ar: 'تَحَدٍّ جَدِيد', en: 'Retry' },
  review: { ar: 'مُرَاجَعَةُ الشَّرْح', en: 'Review' },
  cancel: { ar: 'إِلْغَاء', en: 'Cancel' },
  
  // شاشات الانتقال
  startJourney: { ar: 'اِضْغَطْ لِبَدْءِ الرِّحْلَة', en: '▶️ Press to Start' },
  skipIntro: { ar: 'تَخَطِّي الْمُقَدِّمَة', en: 'Skip Intro' },
  continueStory: { ar: 'مُتَابَعَةُ الْحِكَايَة', en: 'Continue Story' },
  showFullText: { ar: 'عَرْضُ النَّصِّ كَامِلًا', en: 'Show Full Text' },
  
  // شاشة المثال
  listenToExplanation: { ar: 'اِسْمَعِ الشَّرْح', en: 'Listen to explanation' },
  stopAudio: { ar: 'إِيقَافُ الصَّوْت', en: 'Stop audio' },
  readyForChallenge: { ar: 'أَنَا مُسْتَعِدٌّ لِلتَّحَدِّي', en: 'Ready for Challenge' },
  
  // شاشة التحدي
  question: { ar: 'السُّؤَال', en: 'Q' },
  digitalTablet: { ar: 'لَوْحٌ طِينِيٌّ رَقْمِيّ', en: 'Digital Tablet' },
  archSpeedChallenge: { ar: 'تَحَدِّي السُّرْعَةِ الْأَثَرِيَّة', en: 'Speed Challenge' },
  
  // الإدخال (لوحة / عجلة / ميكروفون)
  keypadMode: { ar: 'لَوْحَةُ الْأَحْجَار', en: 'Keypad' },
  dialMode: { ar: 'الْعَجَلَةُ الزَّمَنِيَّة', en: 'Time Dial' },
  dialStamp: { ar: 'اِخْتِمْ', en: 'Stamp' },
  micStart: { ar: 'اِنْطِقِ الْإِجَابَة', en: 'Speak answer' },
  micListening: { ar: 'أَسْتَمِعُ إِلَيْك', en: 'Listening...' },
  micNotHeard: { ar: 'لَمْ أَسْمَعْك، جَرِّبْ مُجَدَّدًا', en: "Didn't catch that, try again" },
  micDenied: { ar: 'الْمِيكْرُوفُونُ غَيْرُ مُتَاح، اِسْتَخْدِمِ اللَّوْحَة', en: 'Mic unavailable, use the keypad' },

  // التغذية الراجعة (Time Echoes)
  encourage1: { ar: 'قَرِيبٌ جِدًّا، حَاوِلْ مَرَّةً أُخْرَى', en: 'So close, try again' },
  encourage2: { ar: 'لَا بَأْس، أَنْتَ تَتَعَلَّم! مَرَّةً أَخِيرَة', en: "That's okay, you're learning! One more try" },
  hintDirect: { ar: 'فَكِّرْ فِي الْخَرَزَات: اِجْمَعِ الْأَعْلَى ثُمَّ الْأَسْفَل', en: 'Think of the beads: add the top first, then the bottom.' },
  hintComplement5: { ar: 'تَلْمِيح: اِسْتَخْدِمْ صَدِيقَ الْخَمْسَة، الْخَرَزَةَ الْعُلْوِيَّة', en: 'Hint: use the Friend of 5 (the top bead).' },
  hintComplement10: { ar: 'تَلْمِيح: اِسْتَخْدِمْ صَدِيقَ الْعَشَرَة، أَضِفْ عَشَرَةً وَاطْرَحِ الْمُتَمِّم', en: 'Hint: use the Friend of 10, add ten and remove the complement.' },
  hintCombined: { ar: 'تَلْمِيح: اِسْتَخْدِمِ الْقَاعِدَةَ الْمُرَكَّبَة، زَائِد عَشَرَة، نَاقِص خَمْسَة، زَائِد مُتَمِّمِ الْمُكَمِّل', en: 'Hint: use the combined rule (+10 - 5 + complement).' },
  hintMitori: { ar: 'تَلْمِيح: اِجْمَعْ رَقْمًا رَقْمًا وَانْظُرْ لِلنَّتِيجَةِ الْجُزْئِيَّة', en: 'Hint: add one number at a time and track the running total.' },
  hintMultiplication: { ar: 'تَلْمِيح: قَسِّمِ الضَّرْبَ إِلَى عَشَرَاتٍ وَآحَاد', en: 'Hint: split the multiplication into tens and ones.' },
  hintDivision: { ar: 'تَلْمِيح: كَمْ مَرَّةً يَتَّسِعُ الْمَقْسُومُ عَلَيْه؟', en: 'Hint: how many times does the divisor fit?' },
  hintSubtraction: { ar: 'تَلْمِيح: اِنْتَبِهْ لِلِاسْتِلَافِ مِنَ الْخَانَةِ الْأَعْلَى', en: 'Hint: watch for borrowing from the next column.' },
  hintDigits: { ar: 'الْإِجَابَةُ مِنْ {n} خَانَة وَتَبْدَأُ بِالرَّقْمِ {d}', en: 'The answer has {n} digit(s) and starts with {d}.' },
  revealMsg: { ar: 'الْإِجَابَةُ هِيَ {a}. سَنَتَدَرَّبُ عَلَيْهَا لَاحِقًا!', en: 'The answer is {a}. We will practice it later!' },

  // رسائل النجاح والفشل
  needMoreSpeed: { ar: 'تَحْتَاجُ إِلَى مَزِيدٍ مِنَ السُّرْعَة!', en: 'Need More Speed!' },
  needMoreSpeedDesc: { 
    ar: 'تَحْتَاجُ إِلَى مَزِيدٍ مِنَ السُّرْعَةِ لِلِامْتِحَان، تَدَرَّبْ جَيِّدًا لِتَكُونَ جَاهِزًا', 
    en: 'You need more speed for the exam, practice well to be ready.' 
  },
  successMsg: { ar: 'عَبَرْتَ الْبَوَّابَةَ بِنَجَاح!', en: 'Gate Crossed Successfully!' },
  returnToGames: { ar: 'الْعَوْدَةُ لِمَدِينَةِ الْأَلْعَاب', en: 'Return to Games' },
  
  // عام
  champion: { ar: 'بَطَل', en: 'Champion' },
  archiveGuide: { ar: 'مُرْشِدٌ زَمَنِيّ', en: 'Archive Guide' },
  correct: { ar: 'إِجَابَةٌ صَحِيحَة!', en: 'Correct answer!' },
  wrong: { ar: 'إِجَابَةٌ خَاطِئَة، حَاوِلْ أَسْرَع', en: 'Wrong answer, try faster.' },

  // شاشة الخريطة
  gameTitle: { ar: 'بَوَّابَةُ الثَّقْبِ الدُّودِيّ', en: 'Wormhole Gate' },
  backToGamesCity: { ar: 'الْعَوْدَةُ لِمَدِينَةِ الْأَلْعَاب', en: 'Back to Game City' },
  statusCompleted: { ar: 'مُكْتَمِل', en: 'Completed' },
  statusBestScore: { ar: 'أَفْضَلُ نَتِيجَة', en: 'Best Score' },
  statusAvailable: { ar: 'مُتَاحٌ لِلَّعِب', en: 'Available to Play' },
  statusLocked: { ar: 'مُغْلَق', en: 'Locked' },

  // قسم الامتحانات (القائمة والإعداد)
  examsTitle: { ar: 'قِسْمُ الِامْتِحَانَات، كْيُو', en: 'Kyu Exams' },
  examsSubtitle: { ar: 'مُحَاكَاةٌ رَسْمِيَّةٌ لِامْتِحَانَاتِ نِيشُورِين', en: 'Official Nishuren simulation' },
  backToMap: { ar: 'الْعَوْدَةُ لِلْخَرِيطَة', en: 'Back to Map' },
  examTip: { 
    ar: 'لِلْحُصُولِ عَلَى دَرَجَةِ الْكْيُو، يَجِبُ حَلُّ الِامْتِحَانِ بِوَضْعِ امْتِحَان، وَالْحُصُولِ عَلَى أَرْبَعِمِائَةٍ مِنْ خَمْسِمِائَةٍ أَوْ أَكْثَر. وَضْعُ تَدْرِيب لَا يَفْتَحُ الِامْتِحَانَ التَّالِي', 
    en: '💡 To earn the Kyu grade, solve in "Exam" mode with 400/500+. "Training" mode does not unlock the next exam.' 
  },
  examQuestions: { ar: 'الْأَسْئِلَة', en: 'Questions' },
  examMarks: { ar: 'الْعَلَامَات', en: 'Marks' },
  examTime: { ar: 'الْوَقْت', en: 'Time' },
  examPass: { ar: 'النَّجَاح', en: 'Pass' },
  examBest: { ar: 'أَفْضَلُ نَتِيجَة', en: 'Best' },
  examTraining: { ar: 'تَدْرِيب', en: 'Training' },
  examTrainingDesc: { ar: 'بِلَا مُؤَقِّت، لَا يَفْتَحُ التَّالِي', en: 'No timer · no unlock' },
  examMode: { ar: 'امْتِحَان', en: 'Exam' },
  examModeDesc: { ar: 'بِمُؤَقِّت، يَفْتَحُ التَّالِي', en: 'With timer · unlocks next' },
  startExam: { ar: 'اِبْدَأ', en: 'Start' },
  comingSoon: { ar: 'قَرِيبًا', en: 'Coming Soon' },
  backToExams: { ar: 'الْعَوْدَةُ لِقَائِمَةِ الِامْتِحَانَات', en: 'Back to Exams' },
  fullSimulation: { ar: 'مُحَاكَاةٌ رَسْمِيَّةٌ كَامِلَة', en: 'Full official simulation' },

  // داخل الامتحان (Runner)
  finishExam: { ar: 'إِنْهَاء', en: 'Finish' },
  confirmFinishMsg: { ar: 'هَلْ أَنْتَ مُتَأَكِّدٌ مِنْ إِنْهَاءِ الِامْتِحَانِ وَتَسْلِيمِ إِجَابَاتِك؟', en: 'Are you sure you want to finish and submit?' },
  answered: { ar: 'تَمَّتِ الْإِجَابَة', en: 'Answered' },
  timeLeft: { ar: 'الْوَقْتُ الْمُتَبَقِّي', en: 'Time Left' },

  // النتائج وسجل التصحيح
  passedTitle: { ar: 'نَجَحْت!', en: 'Passed!' },
  failedTitle: { ar: 'لَمْ تَنْجَحْ هَذِهِ الْمَرَّة', en: 'Not this time' },
  finalScore: { ar: 'النَّتِيجَةُ النِّهَائِيَّة', en: 'Final Score' },
  gradeEarned: { ar: 'الدَّرَجَةُ الْمُكْتَسَبَة', en: 'Grade earned' },
  reviewAnswers: { ar: 'مُرَاجَعَةُ الْإِجَابَات', en: 'Review Answers' },
  printPaper: { ar: 'طِبَاعَةُ وَرَقَة', en: 'Print Paper' },
  printTitle: { ar: 'وَرَقَةٌ تَدْرِيبِيَّة، امْتِحَانُ عَشَرَةٍ إِلَى سَبْعَةِ كْيُو', en: 'Practice Paper - 10-7 Kyu Exam' },
  yourAnswer: { ar: 'إِجَابَتُك', en: 'Your answer' },
  correctAnswer: { ar: 'الْإِجَابَةُ الصَّحِيحَة', en: 'Correct answer' },
  notAnswered: { ar: 'لَمْ تَتِمَّ الْإِجَابَة', en: 'Not answered' },
  backToExamsList: { ar: 'الْعَوْدَةُ لِلِامْتِحَانَات', en: 'Back to Exams' },

  // 👇 رسائل وضع التدريب (التشخيصية)
  // تم تحويل L7 و L8 إلى كلمات لضمان نطقها بشكل صحيح
  trainReadyKyu7: { ar: 'مُسْتَوَاكَ سَبْعَةُ كْيُو، أَنْتَ جَاهِزٌ لِلِامْتِحَانِ الْفِعْلِيّ!', en: 'You reached 7 Kyu. You are ready for the real exam!' },
  trainNeedKyu8: { ar: 'مُسْتَوَاكَ ثَمَانِيَةُ كْيُو، تَسْتَطِيعُ التَّدْرِيبَ أَكْثَرَ لِاجْتِيَازِ الِامْتِحَان.', en: 'You reached 8 Kyu. Train more to pass the exam.' },
  trainNeedKyu9: { ar: 'مُسْتَوَاكَ تِسْعَةُ كْيُو، تَسْتَطِيعُ التَّدْرِيبَ أَكْثَرَ لِاجْتِيَازِ الِامْتِحَان.', en: 'You reached 9 Kyu. Train more to pass the exam.' },
  trainNeedKyu10: { ar: 'مُسْتَوَاكَ عَشَرَةُ كْيُو، تَسْتَطِيعُ التَّدْرِيبَ أَكْثَرَ لِاجْتِيَازِ الِامْتِحَان.', en: 'You reached 10 Kyu. Train more to pass the exam.' },
  trainNeedMore: { ar: 'تَحْتَاجُ مَزِيدًا مِنَ التَّدْرِيبِ بِتَرْكِيزٍ لِتَتَمَكَّنَ مِنَ الِاجْتِيَاز.', en: 'You need more focused training to pass.' },
};

export type UIKey = keyof typeof UI_TEXT;

// دالة الترجمة للواجهات
export function tUI(key: UIKey): string {
  const lang = useLangStore.getState().lang;
  return UI_TEXT[key][lang === 'en' ? 'en' : 'ar'];
}