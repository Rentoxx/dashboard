// src/components/Footer.tsx
export const Footer = () => {
    return (
        <footer className="w-full border-t border-dark-subtle/50 bg-dark-surface/50">
            {/* Höhe von h-16 auf h-14 reduziert */}
            <div className="container mx-auto flex h-14 max-w-5xl items-center justify-center px-4">
                <p className="text-sm text-gray-400">
                    © {new Date().getFullYear()} tguentner.tech. Alle Rechte vorbehalten.
                </p>
            </div>
        </footer>
    );
};