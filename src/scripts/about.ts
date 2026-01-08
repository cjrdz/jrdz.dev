const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -80px 0px",
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".anim-item").forEach((el) => {
        observer.observe(el);
    });
});