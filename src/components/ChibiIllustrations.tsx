import React from 'react';

/**
 * Custom Korean Cute Education / 3D Chibi Cute SVG accents & School Banner Placeholder
 * for SD Negeri Karanggintung 06.
 */
export const ChibiMascotBadge: React.FC<{
  variant?: 'teacher' | 'student' | 'star' | 'school';
  className?: string;
}> = ({ variant = 'student', className = 'w-14 h-14' }) => {
  if (variant === 'teacher') {
    return (
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="teacherBg" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#EFF6FF" />
            <stop offset="100%" stopColor="#DBEAFE" />
          </radialGradient>
          <linearGradient id="hijabGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <radialGradient id="skinGrad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFF1E6" />
            <stop offset="100%" stopColor="#FCD5B5" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="54" fill="url(#teacherBg)" stroke="#BFDBFE" strokeWidth="3" />
        {/* Hijab */}
        <path
          d="M28 66C28 38 42 22 60 22C78 22 92 38 92 66C92 84 82 98 60 98C38 98 28 84 28 66Z"
          fill="url(#hijabGrad)"
        />
        {/* Chibi Face */}
        <circle cx="60" cy="57" r="22" fill="url(#skinGrad)" />
        {/* Blush */}
        <ellipse cx="47" cy="62" rx="4.5" ry="2.5" fill="#FDA4AF" opacity="0.7" />
        <ellipse cx="73" cy="62" rx="4.5" ry="2.5" fill="#FDA4AF" opacity="0.7" />
        {/* Eyes */}
        <circle cx="51" cy="55" r="4" fill="#1E293B" />
        <circle cx="69" cy="55" r="4" fill="#1E293B" />
        <circle cx="52.5" cy="53.5" r="1.4" fill="#FFFFFF" />
        <circle cx="70.5" cy="53.5" r="1.4" fill="#FFFFFF" />
        {/* Warm Smile */}
        <path
          d="M54 64C56 67.5 64 67.5 66 64"
          stroke="#9A3412"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Star pin */}
        <circle cx="79" cy="38" r="5" fill="#FACC15" />
      </svg>
    );
  }

  if (variant === 'star') {
    return (
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="52" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="3" />
        <path
          d="M60 20L71.8 43.9L98.2 47.7L79.1 66.3L83.6 92.6L60 80.2L36.4 92.6L40.9 66.3L21.8 47.7L48.2 43.9L60 20Z"
          fill="url(#starGrad)"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="52" cy="57" r="3" fill="#1E293B" />
        <circle cx="68" cy="57" r="3" fill="#1E293B" />
        <path d="M55 65C57 68 63 68 65 65" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="stuBg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FCE7F3" />
          <stop offset="100%" stopColor="#E0E7FF" />
        </radialGradient>
        <radialGradient id="stuSkin" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#FFF1E6" />
          <stop offset="100%" stopColor="#FCD5B5" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="54" fill="url(#stuBg)" stroke="#C7D2FE" strokeWidth="3" />
      {/* SD Hat Red & White */}
      <path d="M34 45C34 30 45 22 60 22C75 22 86 30 86 45H34Z" fill="#DC2626" />
      <path d="M32 43H88C90 43 92 47 88 49H32C28 47 30 43 32 43Z" fill="#FFFFFF" />
      {/* Face */}
      <circle cx="60" cy="61" r="22" fill="url(#stuSkin)" />
      {/* Cute Eyes */}
      <circle cx="51" cy="59" r="4" fill="#0F172A" />
      <circle cx="69" cy="59" r="4" fill="#0F172A" />
      <circle cx="52.5" cy="57.5" r="1.5" fill="#FFFFFF" />
      <circle cx="70.5" cy="57.5" r="1.5" fill="#FFFFFF" />
      {/* Rosy Cheeks */}
      <ellipse cx="46" cy="65" rx="4.5" ry="2.5" fill="#FB7185" opacity="0.65" />
      <ellipse cx="74" cy="65" rx="4.5" ry="2.5" fill="#FB7185" opacity="0.65" />
      {/* Smile */}
      <path d="M54 67C56.5 71 63.5 71 66 67" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />
      {/* Uniform Collar & Red Tie */}
      <path d="M40 84L60 94L80 84L86 102H34L40 84Z" fill="#FFFFFF" />
      <path d="M56 88H64L66 102H54L56 88Z" fill="#DC2626" />
    </svg>
  );
};

/**
 * Elegant Horizontal Architectural School Illustration Placeholder for SD Negeri Karanggintung 06
 */
export const SchoolBuildingIllustration: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => {
  return (
    <svg
      viewBox="0 0 1200 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-label="Ilustrasi Gedung SD Negeri Karanggintung 06"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F1E36" />
          <stop offset="45%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="roofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="lawnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="50%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
      </defs>

      {/* Sky Canvas */}
      <rect width="1200" height="360" fill="url(#skyGrad)" />

      {/* Soft Pastel Clouds & Korean Cute Sparkles */}
      <circle cx="1040" cy="78" r="46" fill="#FDE047" opacity="0.22" />
      <circle cx="1040" cy="78" r="28" fill="#FEF08A" opacity="0.45" />
      <g opacity="0.16" fill="#FFFFFF">
        <ellipse cx="210" cy="85" rx="75" ry="26" />
        <ellipse cx="255" cy="75" rx="50" ry="22" />
        <ellipse cx="920" cy="95" rx="85" ry="28" />
        <ellipse cx="870" cy="85" rx="55" ry="20" />
      </g>

      {/* Distant Green Hills */}
      <path
        d="M0 290Q250 220 520 285T1200 265V360H0V290Z"
        fill="#1E40AF"
        opacity="0.45"
      />

      {/* School Building Left Wing */}
      <rect x="460" y="165" width="210" height="145" rx="6" fill="#F8FAFC" />
      <path d="M445 168L565 112L685 168H445Z" fill="url(#roofGrad)" />
      {/* Windows Left Wing */}
      <rect x="488" y="192" width="34" height="42" rx="4" fill="#BAE6FD" stroke="#3B82F6" strokeWidth="2" />
      <rect x="538" y="192" width="34" height="42" rx="4" fill="#BAE6FD" stroke="#3B82F6" strokeWidth="2" />
      <rect x="588" y="192" width="34" height="42" rx="4" fill="#BAE6FD" stroke="#3B82F6" strokeWidth="2" />

      {/* School Building Right Wing */}
      <rect x="850" y="165" width="210" height="145" rx="6" fill="#F8FAFC" />
      <path d="M835 168L955 112L1075 168H835Z" fill="url(#roofGrad)" />
      {/* Windows Right Wing */}
      <rect x="888" y="192" width="34" height="42" rx="4" fill="#BAE6FD" stroke="#3B82F6" strokeWidth="2" />
      <rect x="938" y="192" width="34" height="42" rx="4" fill="#BAE6FD" stroke="#3B82F6" strokeWidth="2" />
      <rect x="988" y="192" width="34" height="42" rx="4" fill="#BAE6FD" stroke="#3B82F6" strokeWidth="2" />

      {/* Central Main Pendopo / Hall SD Negeri Karanggintung 06 */}
      <rect x="645" y="140" width="230" height="170" rx="8" fill="#FFFFFF" />
      <path d="M625 145L760 72L895 145H625Z" fill="#2563EB" stroke="#93C5FD" strokeWidth="3" />
      <circle cx="760" cy="116" r="14" fill="#FEF08A" stroke="#1D4ED8" strokeWidth="3" />
      {/* School Entrance Arch */}
      <rect x="725" y="220" width="70" height="90" rx="12" fill="#1E3A8A" />
      <rect x="668" y="172" width="40" height="46" rx="5" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2" />
      <rect x="812" y="172" width="40" height="46" rx="5" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2" />
      {/* School Name Signboard on Building */}
      <rect x="675" y="148" width="170" height="18" rx="4" fill="#FACC15" />

      {/* Flagpole & Bendera Merah Putih */}
      <rect x="757" y="42" width="5" height="268" rx="2.5" fill="#CBD5E1" />
      <circle cx="759.5" cy="40" r="6" fill="#FACC15" />
      <path d="M762 44H826V64H762V44Z" fill="#EF4444" />
      <path d="M762 64H826V84H762V64Z" fill="#FFFFFF" />

      {/* Trees */}
      <circle cx="435" cy="245" r="38" fill="#22C55E" />
      <circle cx="465" cy="255" r="28" fill="#4ADE80" />
      <circle cx="1085" cy="245" r="38" fill="#22C55E" />
      <circle cx="1055" cy="255" r="28" fill="#4ADE80" />

      {/* Foreground Courtyard */}
      <rect y="305" width="1200" height="55" fill="url(#lawnGrad)" />
    </svg>
  );
};
