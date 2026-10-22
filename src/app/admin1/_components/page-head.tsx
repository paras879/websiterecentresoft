import cms from "../cms.module.css";

export function PageHead({ title, lead, sticky, children }: { title: string; lead?: string; sticky?: boolean; children?: React.ReactNode }) {
  return (
    <div className={`${cms.pageHead} ${sticky ? cms.pageHeadSticky : ""}`}>
      <div>
        <h1 className={cms.pageH1}>{title}</h1>
        {lead ? <p className={cms.lead}>{lead}</p> : null}
      </div>
      {children}
    </div>
  );
}
