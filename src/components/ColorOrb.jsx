function ColorOrbs({ color, accent }) {
  const orb1 = useRef(null);
  const orb2 = useRef(null);

  useEffect(() => {
    gsap.to(orb1.current, {
      x: 60,
      y: -40,
      repeat: -1,
      yoyo: true,
      duration: 6,
      ease: "sine.inOut",
    });

    gsap.to(orb2.current, {
      x: -50,
      y: 50,
      repeat: -1,
      yoyo: true,
      duration: 7,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <>
      {/* ORB 1 */}
      <div
        ref={orb1}
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}80, transparent 70%)`,
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ORB 2 */}
      <div
        ref={orb2}
        style={{
          position: "absolute",
          bottom: "15%",
          right: "12%",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}70, transparent 70%)`,
          filter: "blur(50px)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </>
  );
}