import Container from "@/components/common/container";

export default function Footer() {
  return (
    <footer className="border-t py-8">
      <Container>
        <div className="text-center">
          <h3 className="text-lg font-semibold">
            OnlineMBAColleges 2.0
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            Modern Online MBA Discovery Platform
          </p>
        </div>
      </Container>
    </footer>
  );
}