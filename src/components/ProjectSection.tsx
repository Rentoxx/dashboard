export const ProjectSection = () => {
    return (
        <section className="w-full max-w-5xl mx-auto py-24 px-8">
            <h2 className="text-4xl font-bold text-center text-mint">
                Die Mission
            </h2>
            <div className="mt-12 grid md:grid-cols-2 gap-12 items-center">
                <div className="text-lg text-gray-300 space-y-4">
                    <p>
                        Alles begann mit der Herausforderung, einen ressourcenintensiven Minecraft-Server 24/7 zu betreiben. Daraus entstand die Idee für dieses Dashboard: eine zentrale, selbst gehostete Kommandozentrale.
                    </p>
                    <p>
                        Das Ziel ist es, den Status all meiner Server zu visualisieren und den Zugriff auf meine Projekte zu vereinfachen – ein digitaler Maschinenraum, gebaut mit modernen Technologien.
                    </p>
                </div>
                <div className="flex items-center justify-center h-64 bg-dark-surface/50 border-2 border-dashed border-dark-subtle rounded-lg">
                    <p className="text-dark-subtle">[Platzhalter für Architektur-Diagramm]</p>
                </div>
            </div>
        </section>
    );
};
