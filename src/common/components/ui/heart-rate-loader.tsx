"use client"

interface HeartRateLoaderProps {
  text?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function HeartRateLoader({ text = "Carregando...", className = "", size = "md" }: HeartRateLoaderProps) {
  const sizeClasses = {
    sm: "w-24 h-12",
    md: "w-36 h-16",
    lg: "w-48 h-20",
  }

  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <div className="heart-rate-container">
        <div className={`heart-rate ${sizeClasses[size]}`}>
          {/* SVG do batimento cardíaco */}
          <svg viewBox="0 0 150 73" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M0,45.486 L10,45.486 L15,33.486 L25,57.486 L35,20.486 L45,45.486 L55,45.486 L65,45.486 L70,33.486 L80,57.486 L90,20.486 L100,45.486 L110,45.486 L120,45.486 L125,33.486 L135,57.486 L145,20.486 L150,45.486"
              className="heartbeat-line"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Animações de fade */}
          <div className="fade-in"></div>
          <div className="fade-out"></div>
        </div>

        {text && <p className="text-sm font-medium text-muted-foreground mt-4 text-center">{text}</p>}
      </div>

      <style jsx>{`
        .heart-rate-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .heart-rate {
          position: relative;
          margin: 20px auto;
          background-color: hsl(var(--background));
          border-radius: 8px;
          padding: 8px;
          border: 1px solid hsl(var(--border));
        }

        .heartbeat-line {
          stroke: hsl(var(--primary));
          opacity: 0.8;
        }

        .fade-in {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg, 
            transparent 0%, 
            hsl(var(--background)) 50%, 
            hsl(var(--background)) 100%
          );
          top: 0;
          right: 0;
          animation: heartRateIn 2.5s linear infinite;
          border-radius: 8px;
        }

        .fade-out {
          position: absolute;
          width: 120%;
          height: 100%;
          background: linear-gradient(
            90deg, 
            hsl(var(--background)) 0%, 
            hsl(var(--background)) 50%, 
            transparent 100%
          );
          top: 0;
          right: -120%;
          animation: heartRateOut 2.5s linear infinite;
          border-radius: 8px;
        }

        /* Variação para tema escuro */
        .dark .fade-in {
          background: linear-gradient(
            90deg, 
            transparent 0%, 
            hsl(var(--background)) 50%, 
            hsl(var(--background)) 100%
          );
        }

        .dark .fade-out {
          background: linear-gradient(
            90deg, 
            hsl(var(--background)) 0%, 
            hsl(var(--background)) 50%, 
            transparent 100%
          );
        }

        @keyframes heartRateIn {
          0% {
            width: 100%;
          }
          50% {
            width: 0;
          }
          100% {
            width: 0;
          }
        }

        @keyframes heartRateOut {
          0% {
            left: -120%;
          }
          30% {
            left: -120%;
          }
          100% {
            left: 0;
          }
        }

        /* Efeito de pulso adicional */
        .heart-rate::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(
            45deg,
            hsl(var(--primary) / 0.1),
            hsl(var(--secondary) / 0.1)
          );
          border-radius: 10px;
          z-index: -1;
          animation: pulse 2.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  )
}
