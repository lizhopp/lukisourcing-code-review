export default function PageHeader({ eyebrow, title, description, actionLabel }) {
  return (
    <section className="topbar">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actionLabel ? <button className="button primary">{actionLabel}</button> : null}
    </section>
  );
}
