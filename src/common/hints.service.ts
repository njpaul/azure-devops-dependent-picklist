import { IWorkItemFormService } from "azure-devops-extension-api/WorkItemTracking/WorkItemTrackingServices";
import { CascadeMap } from "./types";

export class HintService {
  private workItemService: IWorkItemFormService;
  private isEnabled: boolean;

  public constructor(workItemService: IWorkItemFormService) {
    this.workItemService = workItemService
    this.isEnabled = true
  }

  public setEnabled(isEnabled: boolean): void {
    this.isEnabled = isEnabled
  }

  public async hintFieldValue(
    cascadeMap: CascadeMap,
    changedFieldReferenceName: string,
    changedFieldValue: string
  ): Promise<void> {
    if (this.isEnabled && !changedFieldValue) {
      for (const [option, cascade] of Object.entries(cascadeMap[changedFieldReferenceName].cascades)) {
        if (!cascade.hint) continue;

        // Don't hint the parent field if any of the dependent fields have a
        // value, so that we don't clear out the existing value of the
        // dependent.
        const dependentFieldRefs = Object.keys(cascade).filter(k => k !== 'hint');
        const dependentFieldValues = await this.workItemService.getFieldValues(dependentFieldRefs);
        const dependentHasValue = Object.values(dependentFieldValues).some(v => !!v)

        let shouldHint = false
        if (!dependentHasValue) {
          switch (cascade.hint.when) {
            case 'Area Path':
              shouldHint = await this.hintFromAreaPath(cascade.hint.is);
              break;
          }
        }

        if (shouldHint) {
          await this.workItemService.setFieldValue(changedFieldReferenceName, option);
        }
      }
    }
  }

  private async hintFromAreaPath(hint: string): Promise<boolean> {
    const areaPath = await this.workItemService.getFieldValue('System.AreaPath') as string
    return areaPath.startsWith(hint)
  }
}
