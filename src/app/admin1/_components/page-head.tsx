import cms from "../cms.module.css";

export function PageHead({ title, lead, children }: { title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <div className={cms.pageHead}>
      <div>
        <h1 className={cms.pageH1}>{title}</h1>
        {lead ? <p className={cms.lead}>{lead}</p> : null}
      </div>
      {children}
    </div>
  );
}
